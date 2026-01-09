import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'Catalog', name: 'Categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  description: string;

  @Column()
  Active: boolean;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  updatedAt: Date;
}
