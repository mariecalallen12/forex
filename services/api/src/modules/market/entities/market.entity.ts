import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('markets')
export class Market {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column({ name: 'base_token_id' })
  baseTokenId: string;

  @Column({ name: 'quote_token_id' })
  quoteTokenId: string;

  @Column()
  category: string;

  @Column('decimal', { name: 'tick_size', precision: 20, scale: 8 })
  tickSize: number;

  @Column('decimal', { name: 'min_trade_size', precision: 20, scale: 8 })
  minTradeSize: number;

  @Column({ default: 'active' })
  status: string;
}
