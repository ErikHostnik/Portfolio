export const projects = [
  {
    id: 1,
    title: 'Movie & Game Rating App',
    category: 'Full Stack',
    icon: 'globe',
    description:
      'A full-stack app for rating and reviewing movies and games. Features user authentication, a personal dashboard, and a curated content feed.',
    longDescription:
      'Built with React on the frontend and Node.js/Express on the backend. Uses MongoDB for data persistence. Features include JWT authentication, responsive design, infinite scroll, and user profile management. The rating system supports weighted scores and allows users to build personal watchlists and backlogs.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com/yourusername/movie-game-rating-app',
    demo: null,
    featured: true,
    subProjects: [],
  },
  {
    id: 2,
    title: 'ESP32 Projects',
    category: 'Embedded',
    icon: 'cpu',
    description:
      'A growing collection of embedded systems and IoT projects built with the ESP32 microcontroller — from home automation to sensor networks.',
    longDescription:
      'Exploring the full capabilities of the ESP32 for real-world IoT applications. All projects are written in C++ using the Arduino framework or ESP-IDF. Communication protocols used include WiFi, BLE, MQTT, I2C, SPI, and UART.',
    tags: ['C++', 'ESP32', 'IoT', 'Arduino', 'MQTT'],
    github: null,
    demo: null,
    featured: false,
    subProjects: [
      {
        id: 'esp32-1',
        title: 'Smart Home Controller',
        description:
          'Controls home appliances remotely via MQTT and a custom React dashboard. Supports scenes, schedules, and voice trigger hooks.',
        tags: ['MQTT', 'WiFi', 'React'],
        github: null,
      },
      {
        id: 'esp32-2',
        title: 'Weather Station',
        description:
          'Real-time weather monitoring using DHT22 and BMP280 sensors. Displays temperature, humidity, and pressure on a local OLED and pushes data to a Grafana dashboard.',
        tags: ['I2C', 'Sensors', 'OLED', 'Grafana'],
        github: null,
      },
      {
        id: 'esp32-3',
        title: 'BLE Presence Detection',
        description:
          'Passively scans for known Bluetooth devices to detect room presence and logs events to a lightweight server.',
        tags: ['Bluetooth', 'BLE', 'Python'],
        github: null,
      },
      {
        id: 'esp32-4',
        title: 'LED Matrix Display',
        description:
          'Drives a 32×8 WS2812B matrix to render scrolling text, animations, and live clock/weather data fetched via HTTP.',
        tags: ['WS2812B', 'HTTP', 'Animation'],
        github: null,
      },
    ],
  },
  {
    id: 3,
    title: 'Project Three',
    category: 'Backend',
    icon: 'database',
    description:
      'A high-performance API service built with Python and FastAPI, backed by Redis for caching and task queuing.',
    longDescription:
      'Designed around clean architecture principles with a clear separation between domain logic, application services, and infrastructure adapters. Uses Redis for sub-millisecond cache reads and Celery for background job processing. Includes OpenAPI documentation auto-generated from typed route handlers.',
    tags: ['Python', 'FastAPI', 'Redis', 'Celery'],
    github: 'https://github.com/yourusername/project-three',
    demo: null,
    featured: false,
    subProjects: [],
  },
  {
    id: 4,
    title: 'Project Four',
    category: 'Frontend',
    icon: 'code',
    description:
      'A fast, accessible component library and design system built with React and Vite, styled with Tailwind CSS.',
    longDescription:
      'A themeable, accessible component library built from the ground up. Every component is designed with keyboard navigation, ARIA roles, and reduced-motion support. The design system uses CSS custom properties for tokens and ships with both light and dark themes out of the box.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Storybook'],
    github: 'https://github.com/yourusername/project-four',
    demo: 'https://project-four.vercel.app',
    featured: false,
    subProjects: [],
  },
]
