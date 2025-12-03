import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'link_url', nullable: true })
  linkUrl: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  priority: number;

  @Column({ name: 'starts_at', nullable: true })
  startsAt: Date;

  @Column({ name: 'ends_at', nullable: true })
  endsAt: Date;
}
