import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/index';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { AddressesService } from '../addresses/addresses.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private readonly addressesService: AddressesService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    // Verify address exists and belongs to user
    const address = await this.addressesService.findOne(createOrderDto.addressId);
    if (address.userId !== userId) {
      throw new ForbiddenException('Address does not belong to user');
    }

    // Get cart items
    const cart = await this.cartService.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${item.product.name}`,
        );
      }
    }

    // Calculate total
    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    // Create order
    const order = this.orderRepository.create({
      userId,
      addressId: createOrderDto.addressId,
      status: OrderStatus.PENDING,
      total,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items and decrement stock
    for (const cartItem of cart.items) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      });
      await this.orderItemRepository.save(orderItem);

      // Decrement stock
      await this.productsService.decrementStock(
        cartItem.productId,
        cartItem.quantity,
      );
    }

    // Clear cart
    await this.cartService.clearCart(userId);

    return this.findOne(savedOrder.id, userId);
  }

  async findAll(userId: number, isAdmin: boolean = false): Promise<Order[]> {
    const where = isAdmin ? {} : { userId };
    return this.orderRepository.find({
      where,
      relations: ['items', 'items.product', 'address', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.product.images', 'address', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (userId && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[order.status].includes(updateStatusDto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${updateStatusDto.status}`,
      );
    }

    // If cancelling, restore stock
    if (updateStatusDto.status === OrderStatus.CANCELLED) {
      const orderWithItems = await this.findOne(id);
      for (const item of orderWithItems.items) {
        const product = await this.productsService.findOne(item.productId);
        await this.productsService.updateStock(
          item.productId,
          product.stock + item.quantity,
        );
      }
    }

    order.status = updateStatusDto.status;
    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  async cancel(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.updateStatus(id, { status: OrderStatus.CANCELLED });
  }
}

