import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ProblemMetadata } from './problem-metadata.entity';

@Entity('problem_statements')
export class ProblemStatement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @OneToOne(() => ProblemMetadata, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'metadata_id' })
  metadata: ProblemMetadata;

  @Column()
  metadata_id: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  inputFormat: string;

  @Column({ type: 'text', nullable: true })
  outputFormat: string;

  @Column({ type: 'text', nullable: true })
  constraints: string;

  @Column({ type: 'jsonb', default: [] })
  samples: Array<{ input?: string; output?: string; explanation?: string }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
