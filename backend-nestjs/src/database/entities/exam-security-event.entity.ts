import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Assessment } from './assessment.entity';
import { ExamSession } from './exam-session.entity';

@Entity('exam_security_events')
export class ExamSecurityEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @ManyToOne(() => ExamSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  @Index()
  session: ExamSession;

  @Column()
  session_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidate_id' })
  @Index()
  candidate: User;

  @Column()
  candidate_id: string;

  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessment_id' })
  @Index()
  assessment: Assessment;

  @Column()
  assessment_id: string;

  @Column()
  eventType: string;

  @Column({ default: 'INFO' })
  severity: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
