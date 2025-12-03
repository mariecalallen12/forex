import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { marketId, direction, amount, durationSec } = createOrderDto;

    // Validate amount
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Create order
    const order = this.orderRepository.create({
      userId,
      marketId,
      direction,
      amount,
      durationSec,
      status: 'NEW',
    });

    await this.orderRepository.save(order);

    return {
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
      },
    };
  }

  async getOrder(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    return {
      success: true,
      data: order,
    };
  }

  async getUserOrders(userId: string, page = 1, pageSize = 20) {
    const [items, total] = await this.orderRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
