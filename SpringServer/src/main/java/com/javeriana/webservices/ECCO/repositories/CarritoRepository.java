/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.javeriana.webservices.ECCO.repositories;

import com.javeriana.webservices.ECCO.Model.CarritoCompras;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author randy
 */
public interface CarritoRepository extends JpaRepository<CarritoCompras, Long> {
    
}
