import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  logo: string;

  @Column({ default: '' })
  coverImage: string;

  @Column({ default: '' })
  industry: string;

  @Column({ default: '' })
  website: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: '' })
  headquarters: string;

  @Column({ default: '' })
  companySize: string;

  @Column({ nullable: true })
  foundedYear: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  socialLinks: Record<string, string>;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  techStack: string[];

  @Column({ type: 'jsonb', nullable: true, default: [] })
  benefits: string[];

  @Column({ default: 'Actively Hiring' })
  hiringStatus: string;

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
