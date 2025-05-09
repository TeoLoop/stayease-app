package com.nomadax.repository;

import com.nomadax.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IHotelRepository extends JpaRepository<Hotel, Long> {

    Optional<Hotel> findByName(String name);

    List<Hotel> findByCategoryTitleIn(List<String> titles);


}
