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
import { Problem } from './problem.entity';

@Entity('submissions')
@Index(['userId', 'problemId', 'status'])
@Index(['createdAt'])
@Index(['status'])
@Index(['language'])
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Problem)
  @JoinColumn({ name: 'problemId' })
  problem: Problem;

  @Column({ type: 'uuid' })
  problemId: string;

  @Column({ type: 'text' })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  language: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'Pending',
  })
  status: string;

  @Column({ type: 'float', nullable: true })
  executionTime?: number;

  @Column({ type: 'float', nullable: true })
  memoryUsed?: number;

  @Column({ type: 'int', nullable: true })
  testsPassed?: number;

  @Column({ type: 'int', nullable: true })
  totalTests?: number;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'jsonb', default: [] })
  testResults: Array<{
    testId: string;
    passed: boolean;
    executionTime?: number;
    memoryUsed?: number;
    error?: string;
  }>;

  @Column({ type: 'float', default: 0 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
