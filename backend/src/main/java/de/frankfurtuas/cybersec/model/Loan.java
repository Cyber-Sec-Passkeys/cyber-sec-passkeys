package de.frankfurtuas.cybersec.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Loan {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "customer_id")  // tells JPA how to link this to the Customer table
  private Customer customer;

  private String status;

  private double amount;

  private double interestRate;

  private double monthlyPayment;

  private int termInMonths;

  private String approver;

  private String processor;
}
