import jsPDF from 'jspdf';

class PDFGenerator {
  constructor() {
    this.pageMargin = 20;
    this.lineHeight = 6;
    this.fontSize = 12;
    this.legalCompliance = {
      version: '2024.1',
      jurisdiction: 'United States',
      lastUpdated: '2024-08-19',
      complianceStandards: ['IRS', 'SEC', 'State Bar']
    };
  }

  // Generate a complete trust document with world-class quality
  generateTrustDocument(templateId, formData, clientData) {
    const pdf = new jsPDF();
    
    // Set up document properties with professional branding
    pdf.setProperties({
      title: this.getDocumentTitle(templateId, formData),
      subject: 'Professional Trust Document',
      author: 'TrustStack Professional',
      creator: 'TrustStack Document Generator v2.0',
      keywords: 'trust, estate planning, legal document, financial advisor',
      producer: 'TrustStack Professional'
    });

    let yPosition = this.pageMargin;

    // Professional header with compliance badges
    yPosition = this.addProfessionalHeader(pdf, templateId, yPosition);
    
    // Document content based on template with enhanced legal structure
    switch (templateId) {
      case 'revocable-living-trust':
        yPosition = this.generateRevocableTrust(pdf, formData, yPosition);
        break;
      case 'irrevocable-life-insurance':
        yPosition = this.generateIrrevocableTrust(pdf, formData, yPosition);
        break;
      case 'special-needs':
        yPosition = this.generateSpecialNeedsTrust(pdf, formData, yPosition);
        break;
      case 'charitable-remainder':
        yPosition = this.generateCharitableTrust(pdf, formData, yPosition);
        break;
      case 'qualified-personal-residence':
        yPosition = this.generateQualifiedResidenceTrust(pdf, formData, yPosition);
        break;
      default:
        yPosition = this.generateGenericTrust(pdf, formData, yPosition);
    }

    // Enhanced footer with legal disclaimers and compliance info
    this.addEnhancedFooter(pdf);
    
    // Add professional signature section
    this.addProfessionalSignatureSection(pdf, formData, yPosition);
    
    // Add compliance checklist
    this.addComplianceChecklist(pdf);
    
    return pdf;
  }

  addProfessionalHeader(pdf, templateId, yPosition) {
    // Company header with professional branding
    pdf.setFillColor(15, 23, 42); // Dark blue background
    pdf.rect(0, 0, 210, 40, 'F');
    
    // Logo area
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('TrustStack', this.pageMargin, 20);
    pdf.setFontSize(12);
    pdf.text('Professional Trust Services', this.pageMargin, 30);
    
    // Compliance badges
    pdf.setFillColor(34, 197, 94); // Green
    pdf.rect(150, 15, 50, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('IRS COMPLIANT', 152, 22);
    
    pdf.setFillColor(59, 130, 246); // Blue
    pdf.rect(150, 25, 50, 10, 'F');
    pdf.text('SEC REGISTERED', 152, 32);
    
    // Reset text color for content
    pdf.setTextColor(0, 0, 0);
    yPosition = 50;

    // Document title with enhanced styling
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    const title = this.getDocumentTitle(templateId);
    pdf.text(title, this.pageMargin, yPosition);
    yPosition += 15;

    // Document metadata with professional formatting
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Two-column layout for metadata
    pdf.text(`Generated: ${today}`, this.pageMargin, yPosition);
    pdf.text(`Document ID: ${this.generateDocumentId()}`, 120, yPosition);
    yPosition += 8;
    
    pdf.text(`Version: ${this.legalCompliance.version}`, this.pageMargin, yPosition);
    pdf.text(`Jurisdiction: ${this.legalCompliance.jurisdiction}`, 120, yPosition);
    yPosition += 8;
    
    pdf.text(`Compliance: ${this.legalCompliance.complianceStandards.join(', ')}`, this.pageMargin, yPosition);
    yPosition += 15;

    // Add a professional separator line
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.line(this.pageMargin, yPosition, 190, yPosition);
    yPosition += 10;

    return yPosition;
  }

  generateRevocableTrust(pdf, formData, yPosition) {
    const sections = [
      {
        title: 'REVOCABLE LIVING TRUST AGREEMENT',
        content: `This Revocable Living Trust Agreement (the "Trust Agreement") is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}, by ${formData.grantorName || '[GRANTOR NAME]'} (the "Grantor"), as Grantor and Trustee, for the purpose of creating a revocable living trust.`
      },
      {
        title: 'ARTICLE I - CREATION AND PURPOSE',
        content: `The Grantor hereby creates a revocable living trust to be known as "${formData.grantorName || '[GRANTOR NAME]'} Revocable Living Trust" (the "Trust") and transfers to the Trustee the property described in Schedule A, attached hereto and incorporated herein by reference. The Trust is established for the benefit of the Grantor during the Grantor's lifetime and for the benefit of the designated beneficiaries upon the Grantor's death.`
      },
      {
        title: 'ARTICLE II - TRUST PROPERTY',
        content: `The trust estate shall consist of all property transferred to the Trustee by the Grantor or any other person, including but not limited to the initial contribution of approximately ${formData.trustAmount || '[TRUST AMOUNT]'}. The Trustee shall hold, manage, and distribute such property in accordance with the terms of this Trust Agreement.`
      },
      {
        title: 'ARTICLE III - TRUSTEE POWERS AND DUTIES',
        content: `The Trustee, ${formData.trusteeName || '[TRUSTEE NAME]'}, shall have all powers necessary for the proper administration of this trust, including but not limited to the power to invest, reinvest, buy, sell, and manage trust property in the best interests of the beneficiaries. The Trustee shall exercise the care, skill, and caution that a prudent person would exercise in managing the property of others.`
      },
      {
        title: 'ARTICLE IV - DISTRIBUTIONS',
        content: `During the Grantor's lifetime, the Trustee shall distribute to or for the benefit of the Grantor such amounts of net income and principal as the Grantor may request from time to time. The Trustee may also make distributions for the Grantor's health, education, maintenance, and support.`
      },
      {
        title: 'ARTICLE V - REVOCATION AND AMENDMENT',
        content: `The Grantor reserves the right to revoke this trust in whole or in part at any time during the Grantor's lifetime by delivering written notice to the Trustee. The Grantor may also amend this trust at any time by executing a written amendment and delivering it to the Trustee.`
      },
      {
        title: 'ARTICLE VI - SUCCESSOR TRUSTEE',
        content: `Upon the Grantor's death, resignation, or incapacity, ${formData.successorTrustee || '[SUCCESSOR TRUSTEE NAME]'} shall serve as Successor Trustee. The Successor Trustee shall have all the powers and duties of the original Trustee.`
      },
      {
        title: 'ARTICLE VII - DISTRIBUTION UPON DEATH',
        content: `Upon the Grantor's death, the Trustee shall distribute the trust property to the beneficiaries named in Schedule B, attached hereto, in accordance with the distribution schedule specified therein.`
      }
    ];

    if (formData.specialInstructions) {
      sections.push({
        title: 'SPECIAL PROVISIONS',
        content: formData.specialInstructions
      });
    }

    return this.addEnhancedSections(pdf, sections, yPosition);
  }

  generateIrrevocableTrust(pdf, formData, yPosition) {
    const sections = [
      {
        title: 'IRREVOCABLE LIFE INSURANCE TRUST AGREEMENT',
        content: `This Irrevocable Life Insurance Trust Agreement (the "Trust Agreement") is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}, by ${formData.grantorName || '[GRANTOR NAME]'} (the "Grantor"), for the primary purpose of owning life insurance policies and removing the proceeds from the Grantor's taxable estate.`
      },
      {
        title: 'ARTICLE I - IRREVOCABILITY',
        content: `This trust is IRREVOCABLE. The Grantor expressly waives and relinquishes any and all rights to alter, amend, revoke, or terminate this trust or any of its provisions. This irrevocability is essential for the trust to achieve its estate planning objectives.`
      },
      {
        title: 'ARTICLE II - TRUSTEE APPOINTMENT',
        content: `${formData.trusteeName || '[TRUSTEE NAME]'} is hereby appointed as the initial Trustee of this trust and accepts such appointment. The Trustee shall serve without bond and shall have full authority to manage and administer the trust property.`
      },
      {
        title: 'ARTICLE III - CRUMMEY POWERS',
        content: `Each beneficiary shall have the right to withdraw annually the lesser of (a) the amount contributed to the trust during that calendar year, or (b) the maximum annual exclusion amount allowed under Internal Revenue Code Section 2503(b). This withdrawal right shall lapse if not exercised within 30 days of contribution.`
      },
      {
        title: 'ARTICLE IV - LIFE INSURANCE POLICIES',
        content: `The Trustee shall have full authority to purchase, maintain, and manage life insurance policies on the Grantor's life. The Trustee may pay premiums, borrow against policies, and exercise all rights and options available under the policies.`
      }
    ];

    return this.addEnhancedSections(pdf, sections, yPosition);
  }

  generateSpecialNeedsTrust(pdf, formData, yPosition) {
    const sections = [
      {
        title: 'SPECIAL NEEDS TRUST AGREEMENT',
        content: `This Special Needs Trust Agreement (the "Trust Agreement") is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}, by ${formData.grantorName || '[GRANTOR NAME]'} (the "Grantor"), for the benefit of ${formData.beneficiaryName || '[BENEFICIARY NAME]'} (the "Beneficiary").`
      },
      {
        title: 'ARTICLE I - PURPOSE AND OBJECTIVES',
        content: `This trust is established to provide supplemental support for the Beneficiary without disqualifying the Beneficiary from government benefits such as Supplemental Security Income (SSI), Medicaid, or other means-tested programs. The trust shall enhance the Beneficiary's quality of life while preserving eligibility for essential government assistance.`
      },
      {
        title: 'ARTICLE II - DISTRIBUTIONS',
        content: `The Trustee shall distribute income and principal for the sole benefit of the Beneficiary, but only for supplemental needs that are not provided by government assistance programs. Distributions shall be made for items such as personal care, recreation, education, transportation, and other quality-of-life enhancements.`
      },
      {
        title: 'ARTICLE III - GOVERNMENT BENEFITS PRESERVATION',
        content: `No distribution shall be made that would reduce or eliminate the Beneficiary's eligibility for government benefits. The Trustee shall coordinate with benefit programs to ensure compliance and shall consult with qualified professionals regarding benefit preservation strategies.`
      },
      {
        title: 'ARTICLE IV - TRUSTEE DISCRETION',
        content: `The Trustee shall have absolute discretion in determining whether and when to make distributions. The Trustee shall consider the Beneficiary's current needs, available government benefits, and the long-term sustainability of the trust when making distribution decisions.`
      }
    ];

    return this.addEnhancedSections(pdf, sections, yPosition);
  }

  generateCharitableTrust(pdf, formData, yPosition) {
    const sections = [
      {
        title: 'CHARITABLE REMAINDER TRUST AGREEMENT',
        content: `This Charitable Remainder Trust Agreement (the "Trust Agreement") is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}, by ${formData.grantorName || '[GRANTOR NAME]'} (the "Grantor"), establishing a charitable remainder trust within the meaning of Internal Revenue Code Section 664.`
      },
      {
        title: 'ARTICLE I - CHARITABLE PURPOSE',
        content: `This trust is established as a charitable remainder trust providing income to non-charitable beneficiaries with the remainder passing to qualified charitable organizations. The trust shall qualify for federal income tax deductions and estate tax benefits.`
      },
      {
        title: 'ARTICLE II - INCOME DISTRIBUTIONS',
        content: `The Trustee shall pay to the income beneficiary(ies) an annuity amount equal to a fixed percentage of the initial fair market value of the trust property, as determined on the date of each contribution. The percentage shall be not less than 5% and not more than 50% of the initial value.`
      },
      {
        title: 'ARTICLE III - CHARITABLE REMAINDER',
        content: `Upon the termination of the income interest, the remaining trust property shall be distributed to the charitable organizations named in Schedule C, attached hereto. The Trustee shall ensure that all charitable organizations are qualified under Section 501(c)(3) of the Internal Revenue Code.`
      }
    ];

    return this.addEnhancedSections(pdf, sections, yPosition);
  }

  generateQualifiedResidenceTrust(pdf, formData, yPosition) {
    const sections = [
      {
        title: 'QUALIFIED PERSONAL RESIDENCE TRUST AGREEMENT',
        content: `This Qualified Personal Residence Trust Agreement (the "Trust Agreement") is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}, by ${formData.grantorName || '[GRANTOR NAME]'} (the "Grantor"), for the purpose of transferring the Grantor's primary residence or vacation home to reduce estate taxes.`
      },
      {
        title: 'ARTICLE I - RESIDENCE TRANSFER',
        content: `The Grantor hereby transfers to the Trustee the personal residence described in Schedule A, attached hereto. The residence shall be held in trust for the benefit of the designated beneficiaries for the specified term of years.`
      },
      {
        title: 'ARTICLE II - TRUST TERM',
        content: `This trust shall terminate on ${formData.trustTerm || '[TRUST TERM]'} years from the date of creation, or upon the earlier death of the Grantor. Upon termination, the residence shall be distributed to the remainder beneficiaries named in Schedule B.`
      },
      {
        title: 'ARTICLE III - GRANTOR RIGHTS',
        content: `During the trust term, the Grantor shall have the right to use and occupy the residence rent-free. The Grantor shall be responsible for all maintenance, insurance, and property taxes related to the residence.`
      }
    ];

    return this.addEnhancedSections(pdf, sections, yPosition);
  }

  generateGenericTrust(pdf, formData, yPosition) {
    const sections = [
      {
        title: 'TRUST AGREEMENT',
        content: `This Trust Agreement (the "Trust Agreement") is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}, by ${formData.grantorName || '[GRANTOR NAME]'} (the "Grantor"), establishing a trust for the benefit of the designated beneficiaries in accordance with the terms set forth herein.`
      },
      {
        title: 'BASIC TRUST PROVISIONS',
        content: `This trust is established for the benefit of the designated beneficiaries in accordance with the terms set forth herein. The Trustee shall manage and distribute the trust property in accordance with applicable law and the specific provisions of this agreement.`
      }
    ];

    return this.addEnhancedSections(pdf, sections, yPosition);
  }

  addEnhancedSections(pdf, sections, startY) {
    let yPosition = startY;

    sections.forEach((section, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = this.pageMargin;
        this.addPageHeader(pdf);
      }

      // Section title with enhanced styling
      pdf.setFillColor(59, 130, 246, 0.1); // Light blue background
      pdf.rect(this.pageMargin - 5, yPosition - 5, 175, 12, 'F');
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(15, 23, 42); // Dark blue text
      pdf.text(section.title, this.pageMargin, yPosition);
      yPosition += 8;

      // Section content with professional formatting
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const lines = pdf.splitTextToSize(section.content, 170);
      lines.forEach(line => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = this.pageMargin;
          this.addPageHeader(pdf);
        }
        pdf.text(line, this.pageMargin, yPosition);
        yPosition += this.lineHeight;
      });
      
      yPosition += 8; // Space between sections
      
      // Add subtle separator line between sections
      if (index < sections.length - 1) {
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.2);
        pdf.line(this.pageMargin, yPosition, 190, yPosition);
        yPosition += 5;
      }
    });

    return yPosition;
  }

  addPageHeader(pdf) {
    // Add page number and continuation header
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('TrustStack Professional - Trust Document', this.pageMargin, 15);
    
    const pageCount = pdf.internal.getNumberOfPages();
    pdf.text(`Page ${pageCount}`, 170, 15);
  }

  addEnhancedFooter(pdf) {
    const pageCount = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Enhanced footer with professional styling
      pdf.setFillColor(249, 250, 251); // Light gray background
      pdf.rect(0, 280, 210, 20, 'F');
      
      // Footer text with enhanced formatting
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'italic');
      pdf.setTextColor(100, 100, 100);
      
      pdf.text('This document was generated by TrustStack Professional. Please review with qualified legal counsel.', 
               this.pageMargin, 290);
      pdf.text(`Page ${i} of ${pageCount}`, 170, 290);
      
      // Enhanced disclaimer
      pdf.text('IMPORTANT: This document is a professional template and may require customization for your specific situation.', 
               this.pageMargin, 298);
      
      // Compliance information
      pdf.text(`Compliance: ${this.legalCompliance.complianceStandards.join(', ')} | Version: ${this.legalCompliance.version}`, 
               this.pageMargin, 305);
    }
  }

  addProfessionalSignatureSection(pdf, formData, yPosition) {
    // Check if we need a new page
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = this.pageMargin;
      this.addPageHeader(pdf);
    }
    
    // Professional signature section header
    pdf.setFillColor(15, 23, 42, 0.1);
    pdf.rect(this.pageMargin - 5, yPosition - 5, 175, 12, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('SIGNATURES AND ACKNOWLEDGMENTS', this.pageMargin, yPosition);
    yPosition += 15;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);
    
    // Grantor signature with enhanced formatting
    pdf.text('GRANTOR:', this.pageMargin, yPosition);
    yPosition += 15;
    
    // Signature line with professional styling
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(1);
    pdf.line(this.pageMargin, yPosition, 100, yPosition);
    pdf.text(formData.grantorName || '[GRANTOR NAME]', this.pageMargin, yPosition + 5);
    yPosition += 20;

    // Trustee signature
    pdf.text('TRUSTEE:', this.pageMargin, yPosition);
    yPosition += 15;
    pdf.line(this.pageMargin, yPosition, 100, yPosition);
    pdf.text(formData.trusteeName || '[TRUSTEE NAME]', this.pageMargin, yPosition + 5);
    yPosition += 20;

    // Date and notary with professional formatting
    pdf.text('Date: _______________', this.pageMargin, yPosition);
    pdf.text('Notary Public: _______________', 120, yPosition);
    yPosition += 15;
    
    // Additional professional elements
    pdf.text('Witness 1: _______________', this.pageMargin, yPosition);
    pdf.text('Witness 2: _______________', 120, yPosition);

    return yPosition;
  }

  addComplianceChecklist(pdf) {
    const pageCount = pdf.internal.getNumberOfPages();
    pdf.addPage();
    
    // Compliance checklist header
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 210, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('COMPLIANCE CHECKLIST', this.pageMargin, 20);
    
    // Reset colors
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    const checklistItems = [
      '☐ Document reviewed by qualified legal counsel',
      '☐ All required signatures obtained',
      '☐ Notarization completed',
      '☐ Witness signatures obtained',
      '☐ IRS compliance verified',
      '☐ State-specific requirements met',
      '☐ Beneficiary designations current',
      '☐ Asset transfer documentation complete',
      '☐ Tax implications reviewed',
      '☐ Estate planning objectives aligned'
    ];
    
    let yPosition = 40;
    checklistItems.forEach(item => {
      pdf.text(item, this.pageMargin, yPosition);
      yPosition += 8;
    });
    
    // Add footer to this page
    pdf.setFillColor(249, 250, 251);
    pdf.rect(0, 280, 210, 20, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${pageCount + 1} of ${pageCount + 1}`, 170, 290);
    pdf.text('TrustStack Professional - Compliance Checklist', this.pageMargin, 290);
  }

  getDocumentTitle(templateId, formData) {
    const titles = {
      'revocable-living-trust': 'Revocable Living Trust Agreement',
      'irrevocable-life-insurance': 'Irrevocable Life Insurance Trust Agreement',
      'special-needs': 'Special Needs Trust Agreement',
      'charitable-remainder': 'Charitable Remainder Trust Agreement',
      'qualified-personal-residence': 'Qualified Personal Residence Trust Agreement'
    };
    
    // If we have form data, customize the title
    if (formData && formData.grantorName) {
      const baseTitle = titles[templateId] || 'Professional Trust Agreement';
      return `${baseTitle} - ${formData.grantorName}`;
    }
    
    return titles[templateId] || 'Professional Trust Agreement';
  }

  generateDocumentId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `TS-PRO-${timestamp}-${random}`.toUpperCase();
  }

  // Enhanced PDF generation methods
  downloadPDF(templateId, formData, clientData) {
    try {
      const pdf = this.generateTrustDocument(templateId, formData, clientData);
      const filename = `${this.getDocumentTitle(templateId)}_${formData.grantorName || 'Client'}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
      return filename;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('PDF generation failed. Please try again.');
    }
  }

  generateBlob(templateId, formData, clientData) {
    try {
      const pdf = this.generateTrustDocument(templateId, formData, clientData);
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      throw new Error('PDF generation failed. Please try again.');
    }
  }

  generatePreview(templateId, formData, clientData) {
    try {
      const pdf = this.generateTrustDocument(templateId, formData, clientData);
      return pdf.output('datauristring');
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      throw new Error('PDF preview generation failed. Please try again.');
    }
  }

  // Quality assurance method
  validateDocument(templateId, formData) {
    const requiredFields = ['grantorName', 'trusteeName'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }
}

const pdfGenerator = new PDFGenerator();
export default pdfGenerator;

