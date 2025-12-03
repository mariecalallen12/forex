import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  currency: string;

  @Column('decimal', { precision: 20, scale: 8, default: 0 })
  balance: number;

  @Column('decimal', { precision: 20, scale: 8, default: 0 })
  locked: number;
}
