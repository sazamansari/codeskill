import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  domain: string;

  @Column({ default: '' })
  logo: string;

  @Column({ default: '' })
  coverImage: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  website: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: '' })
  contactEmail: string;

  @Column({ default: '' })
  tier: string;

  @Column({ nullable: true })
  establishedYear: number;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column()
  created_by_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
