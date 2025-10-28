import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  kcal: number;

  @Column('float')
  protein: number;

  @Column('float')
  carbs: number;

  @Column('float')
  fats: number;

  @Column('float')
  carbs_simple: number;

  @Column('float')
  carbs_complex: number;

  @Column('float')
  fats_saturated: number;

  @Column('float')
  fats_unsaturated: number;

  @Column()
  is_animal_product: boolean;
}