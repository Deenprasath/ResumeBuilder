// Global state
let currentPage = 'home';
let currentSection = 'personal';
let resumeData = {
    personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
};

// Utility functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function sanitizeText(text) {
    return text.replace(/[<>]/g, '').trim();
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId.replace('Page', '');
}

function showHome() {
    showPage('homePage');
}

function showBuilder() {
    showPage('builderPage');
    loadFormData();
}

function showPreview() {
    saveFormData();
    generatePreview();
    showPage('previewPage');
}

// Section navigation
function switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionId}Section`).classList.add('active');
    
    currentSection = sectionId;
}

// Form data management
function saveFormData() {
    // Personal info
    resumeData.personalInfo = {
        fullName: sanitizeText(document.getElementById('fullName').value),
        jobTitle: sanitizeText(document.getElementById('jobTitle').value),
        email: sanitizeText(document.getElementById('email').value),
        phone: sanitizeText(document.getElementById('phone').value),
        location: sanitizeText(document.getElementById('location').value),
        website: sanitizeText(document.getElementById('website').value),
        linkedin: sanitizeText(document.getElementById('linkedin').value),
        github: sanitizeText(document.getElementById('github').value)
    };
    
    // Summary
    resumeData.summary = sanitizeText(document.getElementById('summary').value);
    
    // Save dynamic sections
    saveExperienceData();
    saveEducationData();
    saveSkillsData();
    saveProjectsData();
    
    // Save to localStorage
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

function loadFormData() {
    // Load personal info
    document.getElementById('fullName').value = resumeData.personalInfo.fullName || '';
    document.getElementById('jobTitle').value = resumeData.personalInfo.jobTitle || '';
    document.getElementById('email').value = resumeData.personalInfo.email || '';
    document.getElementById('phone').value = resumeData.personalInfo.phone || '';
    document.getElementById('location').value = resumeData.personalInfo.location || '';
    document.getElementById('website').value = resumeData.personalInfo.website || '';
    document.getElementById('linkedin').value = resumeData.personalInfo.linkedin || '';
    document.getElementById('github').value = resumeData.personalInfo.github || '';
    
    // Load summary
    document.getElementById('summary').value = resumeData.summary || '';
    updateCharCount();
    
    // Load dynamic sections
    renderExperienceList();
    renderEducationList();
    renderSkillsList();
    renderProjectsList();
}

// Character counter for summary
function updateCharCount() {
    const summary = document.getElementById('summary');
    const counter = document.getElementById('summaryCount');
    if (summary && counter) {
        const count = summary.value.length;
        counter.textContent = count;
        counter.style.color = count > 500 ? '#ef4444' : '#64748b';
    }
}

// Experience management
function addExperience() {
    const experience = {
        id: Date.now(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    };
    resumeData.experience.push(experience);
    renderExperienceList();
}

function removeExperience(id) {
    resumeData.experience = resumeData.experience.filter(exp => exp.id !== id);
    renderExperienceList();
}

function updateExperience(id, field, value) {
    const experience = resumeData.experience.find(exp => exp.id === id);
    if (experience) {
        experience[field] = field === 'current' ? value : sanitizeText(value);
        if (field === 'current' && value) {
            experience.endDate = '';
        }
    }
}

function renderExperienceList() {
    const container = document.getElementById('experienceList');
    
    if (resumeData.experience.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No work experience added yet</p>
                <button class="add-btn" onclick="addExperience()">Add Your First Experience</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = resumeData.experience.map((exp, index) => `
        <div class="list-item">
            <div class="item-header">
                <h3 class="item-title">Experience ${index + 1}</h3>
                <button class="remove-btn" onclick="removeExperience(${exp.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                </button>
            </div>
            <div class="form-container">
                <div class="input-group">
                    <label class="input-label">Company</label>
                    <input type="text" class="form-input" value="${exp.company}" onchange="updateExperience(${exp.id}, 'company', this.value)" placeholder="Google">
                </div>
                <div class="input-group">
                    <label class="input-label">Position</label>
                    <input type="text" class="form-input" value="${exp.position}" onchange="updateExperience(${exp.id}, 'position', this.value)" placeholder="Software Engineer">
                </div>
                <div class="input-group">
                    <label class="input-label">Location</label>
                    <input type="text" class="form-input" value="${exp.location}" onchange="updateExperience(${exp.id}, 'location', this.value)" placeholder="San Francisco, CA">
                </div>
                <div class="input-group">
                    <label class="input-label">Start Date</label>
                    <input type="month" class="form-input" value="${exp.startDate}" onchange="updateExperience(${exp.id}, 'startDate', this.value)">
                </div>
                <div class="input-group">
                    <label class="input-label">End Date</label>
                    <input type="month" class="form-input" value="${exp.endDate}" onchange="updateExperience(${exp.id}, 'endDate', this.value)" ${exp.current ? 'disabled' : ''}>
                </div>
            </div>
            <div class="checkbox-wrapper">
                <input type="checkbox" ${exp.current ? 'checked' : ''} onchange="updateExperience(${exp.id}, 'current', this.checked)">
                <label>I currently work here</label>
            </div>
            <div class="input-group full-width">
                <label class="input-label">Description</label>
                <textarea class="form-textarea" rows="4" onchange="updateExperience(${exp.id}, 'description', this.value)" placeholder="Describe your key responsibilities and achievements...">${exp.description}</textarea>
            </div>
        </div>
    `).join('');
}

function saveExperienceData() {
    // Data is already saved in updateExperience function
}

// Education management
function addEducation() {
    const education = {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
    };
    resumeData.education.push(education);
    renderEducationList();
}

function removeEducation(id) {
    resumeData.education = resumeData.education.filter(edu => edu.id !== id);
    renderEducationList();
}

function updateEducation(id, field, value) {
    const education = resumeData.education.find(edu => edu.id === id);
    if (education) {
        education[field] = sanitizeText(value);
    }
}

function renderEducationList() {
    const container = document.getElementById('educationList');
    
    if (resumeData.education.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No education added yet</p>
                <button class="add-btn" onclick="addEducation()">Add Your Education</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = resumeData.education.map((edu, index) => `
        <div class="list-item">
            <div class="item-header">
                <h3 class="item-title">Education ${index + 1}</h3>
                <button class="remove-btn" onclick="removeEducation(${edu.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                </button>
            </div>
            <div class="form-container">
                <div class="input-group">
                    <label class="input-label">Institution</label>
                    <input type="text" class="form-input" value="${edu.institution}" onchange="updateEducation(${edu.id}, 'institution', this.value)" placeholder="Stanford University">
                </div>
                <div class="input-group">
                    <label class="input-label">Degree</label>
                    <input type="text" class="form-input" value="${edu.degree}" onchange="updateEducation(${edu.id}, 'degree', this.value)" placeholder="Bachelor of Science">
                </div>
                <div class="input-group">
                    <label class="input-label">Field of Study</label>
                    <input type="text" class="form-input" value="${edu.field}" onchange="updateEducation(${edu.id}, 'field', this.value)" placeholder="Computer Science">
                </div>
                <div class="input-group">
                    <label class="input-label">GPA (Optional)</label>
                    <input type="text" class="form-input" value="${edu.gpa}" onchange="updateEducation(${edu.id}, 'gpa', this.value)" placeholder="3.8/4.0">
                </div>
                <div class="input-group">
                    <label class="input-label">Start Date</label>
                    <input type="month" class="form-input" value="${edu.startDate}" onchange="updateEducation(${edu.id}, 'startDate', this.value)">
                </div>
                <div class="input-group">
                    <label class="input-label">End Date</label>
                    <input type="month" class="form-input" value="${edu.endDate}" onchange="updateEducation(${edu.id}, 'endDate', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

function saveEducationData() {
    // Data is already saved in updateEducation function
}

// Skills management
function addSkill() {
    resumeData.skills.push('');
    renderSkillsList();
}

function removeSkill(index) {
    resumeData.skills.splice(index, 1);
    renderSkillsList();
}

function updateSkill(index, value) {
    resumeData.skills[index] = sanitizeText(value);
}

function renderSkillsList() {
    const container = document.getElementById('skillsList');
    
    if (resumeData.skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No skills added yet</p>
                <button class="add-btn" onclick="addSkill()">Add Your First Skill</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = resumeData.skills.map((skill, index) => `
        <div class="skill-item">
            <input type="text" value="${skill}" onchange="updateSkill(${index}, this.value)" placeholder="JavaScript">
            <button class="skill-remove" onclick="removeSkill(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
}

function saveSkillsData() {
    // Data is already saved in updateSkill function
}

// Projects management
function addProject() {
    const project = {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: '',
        github: ''
    };
    resumeData.projects.push(project);
    renderProjectsList();
}

function removeProject(id) {
    resumeData.projects = resumeData.projects.filter(proj => proj.id !== id);
    renderProjectsList();
}

function updateProject(id, field, value) {
    const project = resumeData.projects.find(proj => proj.id === id);
    if (project) {
        project[field] = sanitizeText(value);
    }
}

function renderProjectsList() {
    const container = document.getElementById('projectsList');
    
    if (resumeData.projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No projects added yet</p>
                <button class="add-btn" onclick="addProject()">Add Your First Project</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = resumeData.projects.map((project, index) => `
        <div class="list-item">
            <div class="item-header">
                <h3 class="item-title">Project ${index + 1}</h3>
                <button class="remove-btn" onclick="removeProject(${project.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                </button>
            </div>
            <div class="form-container">
                <div class="input-group">
                    <label class="input-label">Project Name</label>
                    <input type="text" class="form-input" value="${project.name}" onchange="updateProject(${project.id}, 'name', this.value)" placeholder="E-commerce Platform">
                </div>
                <div class="input-group">
                    <label class="input-label">Technologies</label>
                    <input type="text" class="form-input" value="${project.technologies}" onchange="updateProject(${project.id}, 'technologies', this.value)" placeholder="React, Node.js, MongoDB">
                </div>
                <div class="input-group">
                    <label class="input-label">Live Link</label>
                    <input type="url" class="form-input" value="${project.link}" onchange="updateProject(${project.id}, 'link', this.value)" placeholder="https://myproject.com">
                </div>
                <div class="input-group">
                    <label class="input-label">GitHub</label>
                    <input type="url" class="form-input" value="${project.github}" onchange="updateProject(${project.id}, 'github', this.value)" placeholder="https://github.com/user/project">
                </div>
            </div>
            <div class="input-group full-width">
                <label class="input-label">Description</label>
                <textarea class="form-textarea" rows="4" onchange="updateProject(${project.id}, 'description', this.value)" placeholder="Describe the project, your role, and key achievements...">${project.description}</textarea>
            </div>
        </div>
    `).join('');
}

function saveProjectsData() {
    // Data is already saved in updateProject function
}

// Preview generation
function generatePreview() {
    const previewContainer = document.getElementById('resumePreview');
    
    // Contact items with proper truncation
    const contactItems = [
        resumeData.personalInfo.email && `<div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
            ${truncateText(resumeData.personalInfo.email, 25)}
        </div>`,
        resumeData.personalInfo.phone && `<div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            ${resumeData.personalInfo.phone}
        </div>`,
        resumeData.personalInfo.location && `<div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            ${truncateText(resumeData.personalInfo.location, 20)}
        </div>`,
        resumeData.personalInfo.website && `<div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            ${truncateText(resumeData.personalInfo.website.replace(/^https?:\/\//, ''), 20)}
        </div>`,
        resumeData.personalInfo.linkedin && `<div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
            </svg>
            LinkedIn
        </div>`,
        resumeData.personalInfo.github && `<div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            GitHub
        </div>`
    ].filter(Boolean);

    previewContainer.innerHTML = `
        <div class="resume-header">
            <h1 class="resume-name">${resumeData.personalInfo.fullName || 'Your Name'}</h1>
            ${resumeData.personalInfo.jobTitle ? `<div class="resume-job-title">${resumeData.personalInfo.jobTitle}</div>` : ''}
            <div class="resume-contact">
                ${contactItems.join('')}
            </div>
        </div>
        
        <div class="resume-body">
            <div class="resume-main">
                ${resumeData.summary ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Professional Summary</h2>
                        <div class="summary-text">${truncateText(resumeData.summary, 400)}</div>
                    </div>
                ` : ''}
                
                ${resumeData.experience.length > 0 ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Experience</h2>
                        ${resumeData.experience.map(exp => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div class="item-title">${truncateText(exp.position, 40)}</div>
                                    <div class="item-subtitle">${truncateText(exp.company, 35)}</div>
                                    <div class="item-meta">
                                        ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                                        ${exp.location ? ` • ${truncateText(exp.location, 25)}` : ''}
                                    </div>
                                </div>
                                ${exp.description ? `<div class="item-description">${truncateText(exp.description, 300)}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${resumeData.projects.length > 0 ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Projects</h2>
                        ${resumeData.projects.map(project => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div class="item-title">${truncateText(project.name, 40)}</div>
                                    ${project.technologies ? `<div class="item-subtitle">${truncateText(project.technologies, 50)}</div>` : ''}
                                </div>
                                ${project.description ? `<div class="item-description">${truncateText(project.description, 250)}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="resume-sidebar">
                ${resumeData.education.length > 0 ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Education</h2>
                        ${resumeData.education.map(edu => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div class="item-title">${truncateText(edu.degree, 30)} ${edu.field ? `in ${truncateText(edu.field, 20)}` : ''}</div>
                                    <div class="item-subtitle">${truncateText(edu.institution, 30)}</div>
                                    <div class="item-meta">
                                        ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                                        ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${resumeData.skills.length > 0 && resumeData.skills.some(skill => skill.trim()) ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Skills</h2>
                        <div class="skills-grid">
                            ${resumeData.skills.filter(skill => skill.trim()).map(skill => `
                                <div class="skill-tag">${truncateText(skill, 15)}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Enhanced PDF Generation with exact preview matching
function downloadPDF() {
    saveFormData();
    
    if (!resumeData.personalInfo.fullName) {
        alert('Please fill in your name before downloading the PDF.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text, x, y, maxWidth, fontSize = 10, fontWeight = 'normal', color = [0, 0, 0], maxLines = null) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontWeight);
        pdf.setTextColor(color[0], color[1], color[2]);
        
        let lines = pdf.splitTextToSize(text, maxWidth);
        
        if (maxLines && lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
            if (lines[lines.length - 1].length > 0) {
                lines[lines.length - 1] = lines[lines.length - 1].substring(0, lines[lines.length - 1].length - 3) + '...';
            }
        }
        
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Header with gradient background (simulated with dark rectangle)
    const headerHeight = 50;
    pdf.setFillColor(45, 55, 72); // Dark blue-gray matching the preview
    pdf.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Name in white
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const nameWidth = pdf.getTextWidth(resumeData.personalInfo.fullName);
    pdf.text(resumeData.personalInfo.fullName, (pageWidth - nameWidth) / 2, 20);
    
    // Job title
    if (resumeData.personalInfo.jobTitle) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        const titleWidth = pdf.getTextWidth(resumeData.personalInfo.jobTitle);
        pdf.text(resumeData.personalInfo.jobTitle, (pageWidth - titleWidth) / 2, 30);
    }
    
    // Contact info in header
    const contactInfo = [
        resumeData.personalInfo.email,
        resumeData.personalInfo.phone,
        resumeData.personalInfo.location
    ].filter(Boolean);
    
    if (contactInfo.length > 0) {
        pdf.setFontSize(10);
        const contactText = contactInfo.join(' | ');
        const contactWidth = pdf.getTextWidth(contactText);
        pdf.text(contactText, (pageWidth - contactWidth) / 2, 40);
    }
    
    // Additional contact links
    const additionalContacts = [];
    if (resumeData.personalInfo.linkedin) additionalContacts.push('LinkedIn');
    if (resumeData.personalInfo.github) additionalContacts.push('GitHub');
    if (resumeData.personalInfo.website) additionalContacts.push('Portfolio');
    
    if (additionalContacts.length > 0) {
        pdf.setFontSize(9);
        const additionalText = additionalContacts.join(' | ');
        const additionalWidth = pdf.getTextWidth(additionalText);
        pdf.text(additionalText, (pageWidth - additionalWidth) / 2, 46);
    }
    
    yPosition = headerHeight + 15;
    pdf.setTextColor(0, 0, 0); // Black text for body

    // Two-column layout matching the preview
    const leftColumnWidth = contentWidth * 0.62;
    const rightColumnWidth = contentWidth * 0.33;
    const columnGap = contentWidth * 0.05;
    const rightColumnX = margin + leftColumnWidth + columnGap;
    
    let leftY = yPosition;
    let rightY = yPosition;

    // Left column content
    // Professional Summary
    if (resumeData.summary) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(45, 55, 72);
        pdf.text('PROFESSIONAL SUMMARY', margin, leftY);
        
        // Blue underline
        pdf.setLineWidth(1);
        pdf.setDrawColor(66, 153, 225);
        pdf.line(margin, leftY + 2, margin + 70, leftY + 2);
        
        // Dark accent line
        pdf.setLineWidth(1);
        pdf.setDrawColor(45, 55, 72);
        pdf.line(margin, leftY + 3, margin + 30, leftY + 3);
        
        leftY += 8;
        pdf.setTextColor(74, 85, 104);
        leftY = addText(resumeData.summary, margin, leftY, leftColumnWidth, 10, 'normal', [74, 85, 104]);
        leftY += 10;
    }

    // Experience
    if (resumeData.experience.length > 0) {
        checkNewPage(30);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(45, 55, 72);
        pdf.text('EXPERIENCE', margin, leftY);
        
        // Blue underline
        pdf.setLineWidth(1);
        pdf.setDrawColor(66, 153, 225);
        pdf.line(margin, leftY + 2, margin + 45, leftY + 2);
        
        // Dark accent line
        pdf.setLineWidth(1);
        pdf.setDrawColor(45, 55, 72);
        pdf.line(margin, leftY + 3, margin + 30, leftY + 3);
        
        leftY += 12;

        resumeData.experience.forEach((exp, index) => {
            checkNewPage(25);
            
            // Blue bullet point
            pdf.setFillColor(66, 153, 225);
            pdf.circle(margin + 3, leftY - 2, 1.5, 'F');
            
            // Position title
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(45, 55, 72);
            leftY = addText(exp.position, margin + 8, leftY, leftColumnWidth - 8, 12, 'bold', [45, 55, 72], 1);
            
            // Company name
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(66, 153, 225);
            leftY = addText(exp.company, margin + 8, leftY, leftColumnWidth - 8, 11, 'normal', [66, 153, 225], 1);
            
            // Date and location
            const startDate = formatDate(exp.startDate);
            const endDate = exp.current ? 'Present' : formatDate(exp.endDate);
            const dateText = `${startDate} - ${endDate}`;
            const locationText = exp.location ? ` • ${exp.location}` : '';
            const metaText = dateText + locationText;
            
            if (metaText.trim() !== ' - ') {
                pdf.setFontSize(9);
                pdf.setTextColor(113, 128, 150);
                leftY = addText(metaText, margin + 8, leftY, leftColumnWidth - 8, 9, 'normal', [113, 128, 150], 1);
            }
            
            // Description
            if (exp.description) {
                leftY += 2;
                pdf.setFontSize(10);
                pdf.setTextColor(74, 85, 104);
                leftY = addText(exp.description, margin + 8, leftY, leftColumnWidth - 8, 10, 'normal', [74, 85, 104], 4);
            }
            
            leftY += 8;
        });
    }

    // Projects
    if (resumeData.projects.length > 0) {
        checkNewPage(30);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(45, 55, 72);
        pdf.text('PROJECTS', margin, leftY);
        
        // Blue underline
        pdf.setLineWidth(1);
        pdf.setDrawColor(66, 153, 225);
        pdf.line(margin, leftY + 2, margin + 35, leftY + 2);
        
        // Dark accent line
        pdf.setLineWidth(1);
        pdf.setDrawColor(45, 55, 72);
        pdf.line(margin, leftY + 3, margin + 30, leftY + 3);
        
        leftY += 12;

        resumeData.projects.forEach((project) => {
            checkNewPage(20);
            
            // Blue bullet point
            pdf.setFillColor(66, 153, 225);
            pdf.circle(margin + 3, leftY - 2, 1.5, 'F');
            
            // Project name
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(45, 55, 72);
            leftY = addText(project.name, margin + 8, leftY, leftColumnWidth - 8, 12, 'bold', [45, 55, 72], 1);
            
            // Technologies
            if (project.technologies) {
                pdf.setFontSize(10);
                pdf.setTextColor(66, 153, 225);
                leftY = addText(project.technologies, margin + 8, leftY, leftColumnWidth - 8, 10, 'normal', [66, 153, 225], 1);
            }
            
            // Description
            if (project.description) {
                leftY += 2;
                pdf.setFontSize(10);
                pdf.setTextColor(74, 85, 104);
                leftY = addText(project.description, margin + 8, leftY, leftColumnWidth - 8, 10, 'normal', [74, 85, 104], 3);
            }
            
            leftY += 8;
        });
    }

    // Right column content
    // Education
    if (resumeData.education.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(45, 55, 72);
        pdf.text('EDUCATION', rightColumnX, rightY);
        
        // Blue underline
        pdf.setLineWidth(1);
        pdf.setDrawColor(66, 153, 225);
        pdf.line(rightColumnX, rightY + 2, rightColumnX + 40, rightY + 2);
        
        // Dark accent line
        pdf.setLineWidth(1);
        pdf.setDrawColor(45, 55, 72);
        pdf.line(rightColumnX, rightY + 3, rightColumnX + 30, rightY + 3);
        
        rightY += 12;

        resumeData.education.forEach((edu) => {
            // Blue bullet point
            pdf.setFillColor(66, 153, 225);
            pdf.circle(rightColumnX + 3, rightY - 2, 1.5, 'F');
            
            // Degree
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(45, 55, 72);
            const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree;
            rightY = addText(degreeText, rightColumnX + 8, rightY, rightColumnWidth - 8, 11, 'bold', [45, 55, 72], 2);
            
            // Institution
            pdf.setFontSize(10);
            pdf.setTextColor(66, 153, 225);
            rightY = addText(edu.institution, rightColumnX + 8, rightY, rightColumnWidth - 8, 10, 'normal', [66, 153, 225], 2);
            
            // Date and GPA
            const startDate = formatDate(edu.startDate);
            const endDate = formatDate(edu.endDate);
            const dateText = `${startDate} - ${endDate}`;
            const gpaText = edu.gpa ? ` • GPA: ${edu.gpa}` : '';
            const metaText = dateText + gpaText;
            
            if (metaText.trim() !== ' - ') {
                pdf.setFontSize(8);
                pdf.setTextColor(113, 128, 150);
                rightY = addText(metaText, rightColumnX + 8, rightY, rightColumnWidth - 8, 8, 'normal', [113, 128, 150], 2);
            }
            
            rightY += 8;
        });
    }

    // Skills
    const validSkills = resumeData.skills.filter(skill => skill.trim());
    if (validSkills.length > 0) {
        rightY += 5;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(45, 55, 72);
        pdf.text('SKILLS', rightColumnX, rightY);
        
        // Blue underline
        pdf.setLineWidth(1);
        pdf.setDrawColor(66, 153, 225);
        pdf.line(rightColumnX, rightY + 2, rightColumnX + 25, rightY + 2);
        
        // Dark accent line
        pdf.setLineWidth(1);
        pdf.setDrawColor(45, 55, 72);
        pdf.line(rightColumnX, rightY + 3, rightColumnX + 20, rightY + 3);
        
        rightY += 12;
        
        // Display skills as styled tags
        let currentX = rightColumnX;
        let currentY = rightY;
        const skillsPerRow = 2;
        
        validSkills.forEach((skill, index) => {
            const skillText = truncateText(skill, 12);
            const skillWidth = pdf.getTextWidth(skillText) + 8;
            
            // Check if skill fits in current row
            if (currentX + skillWidth > rightColumnX + rightColumnWidth && index > 0) {
                currentX = rightColumnX;
                currentY += 8;
            }
            
            // Draw skill tag background
            pdf.setFillColor(237, 242, 247);
            pdf.setDrawColor(203, 213, 225);
            pdf.roundedRect(currentX, currentY - 4, skillWidth, 6, 2, 2, 'FD');
            
            // Add skill text
            pdf.setFontSize(9);
            pdf.setTextColor(45, 55, 72);
            pdf.text(skillText, currentX + 4, currentY);
            
            currentX += skillWidth + 4;
            
            // Move to next row after every 2 skills or if we're at the end
            if ((index + 1) % skillsPerRow === 0 || index === validSkills.length - 1) {
                currentX = rightColumnX;
                currentY += 8;
            }
        });
    }

    // Save the PDF with proper filename
    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_Professional.pdf`;
    pdf.save(fileName);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show home page by default
    showHome();
    
    // Load any saved data from localStorage
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        try {
            resumeData = JSON.parse(savedData);
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
    
    // Add character counter to summary
    const summaryTextarea = document.getElementById('summary');
    if (summaryTextarea) {
        summaryTextarea.addEventListener('input', updateCharCount);
    }
    
    // Auto-save functionality
    setInterval(() => {
        if (currentPage === 'builder') {
            saveFormData();
        }
    }, 10000); // Auto-save every 10 seconds
});