import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ProblemMetadata } from './problem-metadata.entity';

@Entity('problem_testcases')
export class ProblemTestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @OneToOne(() => ProblemMetadata, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'metadata_id' })
  metadata: ProblemMetadata;

  @Column()
  metadata_id: string;

  @Column({ type: 'jsonb', default: [] })
  cases: Array<{ input?: string; output?: string; isHidden: boolean; explanation?: string; weight: number }>;

  @Column({ nullable: true })
  s3BucketUrl: string;

  @Column({ type: 'text', nullable: true })
  testCaseGeneratorCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
