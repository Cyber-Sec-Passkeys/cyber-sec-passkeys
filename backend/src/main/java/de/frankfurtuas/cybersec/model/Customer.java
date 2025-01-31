package de.frankfurtuas.cybersec.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String street;

    private String city;

    private String zip;

    private double creditScore;

    private double balanace;

    private double monthlyIncome;

    private double monthlyExpense;

    private double internalAssesment;
}
