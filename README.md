frontend/ has the nextjs app
backshell/ has the backend
challenges/ has challenge schemas


---

# CLASH: Command Line Assistant Shell

Research has shown that [*spaced interval repetition*](https://pmc.ncbi.nlm.nih.gov/articles/PMC8759977/) is the optimal strategy for long-term information retention. However, universities—especially those operating on a quarter system—struggle with effectively implementing this learning technique due to the short time spans available. In contrast, platforms like Leetcode and Duolingo have achieved remarkable success by reinforcing knowledge retention over time. This disparity leads to a common problem: as students advance to upper-division courses, they often find themselves challenged by forgotten fundamentals, such as basic shell commands.

**CLASH aims to fix this issue.**

---

## What It Does

CLASH is an AI-powered educational shell that closely mimics real-world terminals like `bash` and `zsh`. It provides a **realistic yet friendly and secure environment** for learners to practice and refine their shell skills. Key features include:

- **Interactive Learning Environment:** Practice essential shell commands in a controlled setting.
- **Integrated AI Assistance:** Meet Gerald AI, a dedicated assistant that offers real-time guidance and optimization suggestions—without handing out complete answers. For example, Gerald might suggest exploring the `man` command for more information.
- **Safe Execution Environment:** All user commands are routed through a Docker container with restricted permissions (yes, even `rm -rf /` is blocked), ensuring a foolproof experience.

---

## How We Built It

Our solution was engineered with a diverse, modern tech stack to emulate a real terminal environment while maintaining security and speed:

- **Front End:**  
  - **Technologies:** React, NextJS, and Tailwind CSS  
  - **Highlights:**  
    - Implements common terminal conventions such as command recall via the `Up Arrow`.
    - Seamlessly interfaces with the Python backend.

- **Backend:**  
  - **Technologies:** Python with Flask  
  - **Highlights:**  
    - Uses a custom wrapper around the Docker SDK to maintain container persistence between commands.
    - Ensures containers run as non-root for enhanced security.
    - Polls the Gemini API through a custom requests wrapper for smooth integration with the front end.

- **Docker Integration:**  
  - **Deployment:** Each user gets a freshly built Docker container based on a lightweight `alpine` image, ensuring quick startup and a clean working directory.
  - **Performance:** Setup scripts written in C using raw syscalls deliver kernel-level fast execution.
  - **Security:** Custom Dockerfile and container management ensure no direct execution of user commands on the host system.

- **Gemini API:**  
  - **Implementation:** Gerald AI is powered by Google's Gemini 2.0 Flash.  
  - **Challenges:**  
    - Limited documentation required us to reverse engineer the API.
    - Custom prompt engineering was applied to balance helpfulness without revealing full solutions.

---

## Challenges We Faced

Developing CLASH was not without its obstacles. Here are some of the significant challenges and how we tackled them:

### Front End
- **Terminal Emulation:**  
  - Implementing accurate terminal behaviors (e.g., command history recall) required careful event handling.
- **Backend Integration:**  
  - Bridging the React-based front end with a Python Flask backend was complex due to differing paradigms and communication protocols.

### Backend
- **Container Persistence:**  
  - The Docker SDK’s non-persistent behavior necessitated a wrapper to ensure the same container served sequential commands.
- **Security Concerns:**  
  - Running the container as non-root and securing the Docker environment was critical to prevent system misuse.
- **API Polling:**  
  - Interfacing with the new Gemini API involved creating a robust wrapper around standard Python requests.

### Docker
- **Rapid Deployment:**  
  - Quick build and deployment were essential to provide users with a clean environment for each session.
- **Compatibility Issues:**  
  - Developing on Alpine (a musl-based system) posed challenges with glibc-based libraries, prompting us to modify assembly code for compatibility.

### Gemini API
- **Limited Documentation:**  
  - Reverse engineering was necessary due to sparse official documentation, pushing us to deeply understand and optimize API usage.

---

## Accomplishments We’re Proud Of

- **Seamless Integration:**  
  - Successfully built a realistic shell environment complete with an AI assistant, Gerald, that feels like an intrinsic part of the shell.
- **Secure and Efficient Docker Containers:**  
  - Developed a robust containerization strategy that ensures a safe and fast user experience.
- **Innovative Use of Technology:**  
  - Merged modern web technologies with system-level programming in C to achieve optimal performance.

---

## Lessons Learned

- **Technical Compatibility:**  
  - We discovered firsthand that Alpine’s musl libraries do not always play nicely with glibc, prompting us to dive into raw assembly modifications.
- **Docker Proficiency:**  
  - The project significantly deepened our understanding of Docker, its SDK, and container security best practices.
- **API Integration:**  
  - Working with the nascent Gemini API provided valuable insights into reverse engineering and prompt optimization.
- **Front End Performance:**  
  - Ensuring a snappy user experience in the terminal required meticulous front end optimization and seamless integration with the Python backend.

---

## What’s Next for CLASH

We envision CLASH as a transformative tool for educational institutions, particularly within courses like UCSD’s CSE29 (Systems Programming and Software Tools). Our goal is to:

- **Integrate CLASH into University Curricula:**  
  - Provide students with continuous, interactive practice long after the course has concluded.
- **Enhance Knowledge Retention:**  
  - Use AI-driven challenges and spaced interval repetition to ensure that students retain critical skills over the long term.
- **Expand Features and Capabilities:**  
  - Further refine Gerald AI and incorporate new shell functionalities based on user feedback.

CLASH is not just a tool; it’s a commitment to reimagining how we learn and retain essential technical skills. We’re excited about its potential to bridge the gap between academic instruction and real-world application.

---
