import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Assessment } from './assessment.entity';

@Entity('exam_sessions')
@Index(['assessment_id', 'candidate_id'], { unique: true })
export class ExamSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @Column()
  assessment_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidate_id' })
  candidate: User;

  @Column()
  candidate_id: string;

  @Column({ default: 'CREATED' })
  status: string;

  @Column({ default: 'DISABLED' })
  secureMode: string;

  @Column()
  clientType: string;

  @Column({ nullable: true })
  clientVersion: string;

  @Column({ nullable: true })
  configKey: string;

  @Column({ nullable: true })
  browserExamKeyVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastHeartbeatAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ default: 'CLEAN' })
  securityState: string;

  @Column({ default: 0 })
  violationCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
