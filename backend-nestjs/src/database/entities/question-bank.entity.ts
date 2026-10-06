import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('question_banks')
@Index(['topic', 'name'])
export class QuestionBank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  // Storing UUIDs instead of actual references for simplicity in Phase 3
  @Column('uuid', { array: true, default: '{}' })
  questions: string[];

  @Index()
  @Column({ type: 'varchar', length: 255 })
  topic: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy_id' })
  createdBy: User;

  @Index()
  @Column({ type: 'uuid' })
  createdBy_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
