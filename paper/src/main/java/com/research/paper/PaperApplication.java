package com.research.paper;

import com.research.paper.entity.user.Domains;
import com.research.paper.entity.user.Role;
import com.research.paper.repository.User.DomainRepository;
import com.research.paper.repository.User.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Optional;

@SpringBootApplication
public class PaperApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaperApplication.class, args);
	}
	@Bean
	public CommandLineRunner commandLineRunner(final RoleRepository roleRepository, final DomainRepository domainRepository){
		return args ->{
			final Optional<Role> userRole = roleRepository.findByName("ROLE_USER");
			if(userRole.isEmpty()){
				final Role roleUser = new Role();
				roleUser.setName("ROLE_USER");
				roleUser.setCreatedBy("APP");
				roleRepository.save(roleUser);
			}
			final Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN");
			if(adminRole.isEmpty()){
				final Role roleAdmin = new Role();
				roleAdmin.setName("ROLE_ADMIN");
				roleAdmin.setCreatedBy("APP");
				roleRepository.save(roleAdmin);
			}
			final Optional<Domains> domainIA = domainRepository.findByName("Artificial Intelligence");
			if(domainIA.isEmpty()){
				final Domains domains = new Domains();
				domains.setName("Artificial Intelligence");
				domains.setCreatedBy("APP");
				domainRepository.save(domains);
			}
			final Optional<Domains> domainCS = domainRepository.findByName("Computer Science");
			if(domainCS.isEmpty()){
				final Domains domains = new Domains();
				domains.setName("Computer Science");
				domains.setCreatedBy("APP");
				domainRepository.save(domains);
			}
			final Optional<Domains> domainE = domainRepository.findByName("Economics");
			if(domainE.isEmpty()){
				final Domains domains = new Domains();
				domains.setName("Economics");
				domains.setCreatedBy("APP");
				domainRepository.save(domains);
			}

		};
	}

}
