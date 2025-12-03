import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'market_id' })
  marketId: string;

  @Column()
  direction: string;

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @Column({ name: 'duration_sec' })
  durationSec: number;

  @Column({ default: 'NEW' })
  status: string;

  @Column({ nullable: true })
  result: string;

  @Column('decimal', { name: 'payout_amount', precision: 20, scale: 8, nullable: true })
  payoutAmount: number;

  @Column('decimal', { name: 'entry_price', precision: 20, scale: 8, nullable: true })
  entryPrice: number;

  @Column('decimal', { name: 'exit_price', precision: 20, scale: 8, nullable: true })
  exitPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'settled_at', nullable: true })
  settledAt: Date;
}
