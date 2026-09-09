import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  social: { github?: string; linkedin?: string; email?: string };
}

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html'
})
export class AboutComponent {
  /** Fake team data cho Task 1 */
  teamMembers: TeamMember[] = [
    {
      name: 'Nguyen Van A',
      role: 'Project Lead & Backend Developer',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff&size=200',
      bio: 'Full-stack developer with 5+ years experience in .NET and Angular. Passionate about clean architecture.',
      social: { github: '#', linkedin: '#', email: 'nguyenvana@quizapp.com' }
    },
    {
      name: 'Tran Thi B',
      role: 'Frontend Developer',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=8b5cf6&color=fff&size=200',
      bio: 'Angular specialist with a keen eye for UI/UX design. Expert in responsive and accessible web applications.',
      social: { github: '#', linkedin: '#', email: 'tranthib@quizapp.com' }
    },
    {
      name: 'Le Van C',
      role: 'Backend Developer',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=06b6d4&color=fff&size=200',
      bio: 'Database architect and API specialist. Experienced in SQL Server, EF Core, and microservices patterns.',
      social: { github: '#', linkedin: '#', email: 'levanc@quizapp.com' }
    },
    {
      name: 'Pham Thi D',
      role: 'QA & DevOps Engineer',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=f59e0b&color=fff&size=200',
      bio: 'Quality-focused engineer ensuring stability and performance. CI/CD automation and testing enthusiast.',
      social: { github: '#', linkedin: '#', email: 'phamthid@quizapp.com' }
    }
  ];
}
