import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column({ default: 8 })
  decimals: number;

  @Column({ default: 'active' })
  status: string;
}
