import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Project } from '../project.entity';
import { Tag } from '../../tag/tag.entity';
@Entity()
export class ProjectRequirment {
  @ManyToOne(() => Project, (project) => project.projectRequirments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project!: Project;
  @PrimaryColumn()
  projectId!: number;
  @ManyToOne(() => Tag, (tag) => tag.projectRequirments)
  tag!: Tag;
  @PrimaryColumn()
  tagId!: number;
  @Column()
  count!: number;
}
