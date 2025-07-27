# TikTok Slideshow Automation - Project Knowledge Document

## Project Overview

**Client:** Jeremy Abend  
**Project Type:** TikTok Static Slideshow Content Pipeline  
**Platform:** n8n Workflow Automation  
**Timeline:** 1-2 weeks  
**Scope:** MVP focused on static 5-slide carousels (no video in first milestone)

### Business Context

- E-commerce brand specializing in sleep/health products
- Target: Scale automation across ~50 TikTok accounts
- Current test account: [@healthwithstephanie](https://www.tiktok.com/@healthwithstephanie)
- Reference example: [@myglowingskintips](https://www.tiktok.com/@myglowingskintips)

## Core Workflow Requirements

### 1. Asset Creation Pipeline

**Doctor Selfie Generation:**

- Use AI image generation (GPT-Image-1 or Midjourney API)
- **Critical Requirement:** Consistent character appearance across all images
- Style: Ultra-realistic, grainy texture, natural look
- Format: 9:16 vertical iPhone selfie style
- Storage: Google Drive `/selfies/_pending` folder
- Approval: Slack integration with Approve/Reject buttons

### 2. Slide Assembly System

**Content Structure:**

- **Slide 1:** Approved doctor selfie (varies each post)
- **Slides 2-4:** Random selection of 3 sleep tip stock images
- **Slide 5:** Branded product image (pre-captioned)

**Text Overlay Requirements:**

- **Tool:** Node-Canvas implementation
- **Style:** CapCut-style white bubble captions
- **Appearance:** Exact match to TikTok in-app text styling
- **Positioning:** Optimal placement for readability

### 3. Content Generation & Approval

**AI-Powered Metadata:**

- **Service:** OpenAI API integration
- **Output:** Viral-ready titles, descriptions, 5 relevant hashtags
- **Approval Flow:** Slack thread for manual editing/approval
- **Cultural Sensitivity:** Health claims must be appropriate and compliant

### 4. Publishing System

**GeeLark Integration:**

- **Account Type:** Personal TikTok accounts (not Business API)
- **Safety Features:** Device fingerprint protection
- **Music:** Optional TikTok-suggested background music via GeeLark macro
- **Output Location:** Google Drive `/carousels/out`

### 5. Analytics & Performance Tracking

**Nightly Analytics:**

- **Data Sources:** GeeLark API or TikTok Basic Display
- **Metrics:** Video views, likes, engagement data
- **Storage:** Google Sheets integration
- **Analysis:** Flag top-quartile performing first-slide selfies

## Technical Architecture

### n8n Workflow Components

1. **Image Generation Module:** API calls and file management
2. **Approval Module:** Slack integration with interactive buttons
3. **Assembly Module:** Node-Canvas text overlay and image combination
4. **Content Module:** OpenAI for metadata generation
5. **Publishing Module:** GeeLark API integration
6. **Analytics Module:** Performance data collection

### Key Integrations

- **GPT-Image-1/Midjourney API:** Character-consistent image generation
- **Google Drive API:** File storage and organization
- **Slack API:** Approval workflows and notifications
- **OpenAI API:** Content generation
- **GeeLark API:** TikTok posting and analytics
- **Google Sheets API:** Data tracking and reporting

## Image Quality Standards

### Character Consistency Requirements

- **Same person appearance:** Every generated selfie must look like the same individual
- **Technical specs:** Ultra-realistic, grainy texture, natural lighting
- **Format:** 9:16 vertical aspect ratio (iPhone selfie style)
- **Professional appearance:** Medical professional in hospital setting

### Sample Image Generation Prompt

The following prompt exemplifies the type of images we create:

```
"A beautiful young female doctor taking a selfie in a hospital hallway. She has glowing, natural skin, soft wavy hair, and is wearing light makeup. Dressed in teal scrubs with a white lab coat and a stethoscope around her neck. The lighting is natural and soft, highlighting her facial features. Modern hospital setting in the background with bright walls and ceiling lights. Professional yet warm and approachable appearance. High-resolution, realistic photography style."
```

### Key Visual Elements

- **Character:** Beautiful young female doctor with consistent facial features
- **Styling:** Glowing natural skin, soft wavy hair, light makeup
- **Attire:** Teal scrubs, white lab coat, stethoscope
- **Setting:** Modern hospital hallway with bright walls and ceiling lights
- **Lighting:** Natural and soft, highlighting facial features
- **Mood:** Professional yet warm and approachable
- **Quality:** High-resolution, realistic photography style

## Content Strategy

### Slideshow Structure Logic

- **Slide 1 Variation:** Different approved doctor selfie each post
- **Slides 2-4 Mixing:** Random combination of stock sleep tips
- **Slide 5 Consistency:** Same branded product, pre-captioned
- **Reuse Strategy:** Stock images can be reused across different carousels

### Engagement Optimization

- **Platform Preference:** Static slideshows perform better than video animations on TikTok
- **User Engagement:** Swiping through slides counts as engagement signal
- **Format Benefits:** Separate images uploaded as carousel vs. animated transitions

## Deliverables

### 1. Complete n8n Workflow

- **Export Format:** .json file with all configurations
- **Environment Variables:** Clear documentation of required API keys
- **Module Documentation:** Detailed explanation of each component

### 2. Custom Scripts & Tools

- **Node-Canvas Helper:** CapCut-style text overlay script
- **Image Processing:** Quality control and optimization
- **Account Setup:** Templates for easy replication

### 3. Documentation & Training

- **Setup Guide:** Step-by-step installation instructions
- **Cloning Manual:** Replication process for new accounts
- **Troubleshooting:** Common issues and solutions
- **Video Walkthrough:** Loom demonstration of entire process

### 4. Proof of Concept

- **Live Test Post:** End-to-end automation demonstration
- **Account Integration:** Working connection with @healthwithstephanie
- **Performance Validation:** Successful posting and analytics collection

## Scalability Requirements

### Template Design for 50+ Accounts

- **Modular Architecture:** Independent components for easy replication
- **Configuration Templates:** Standardized settings for quick setup
- **Account Isolation:** Separate configurations prevent cross-contamination
- **Proxy Considerations:** Rate limiting and IP rotation support

### Future Enhancement Readiness

- **Video Module Hooks:** Ready integration points for future video features
- **Analytics Enhancement:** Foundation for advanced competitor analysis
- **Content Mutation:** Framework for content variation features
- **Advanced AI:** Easy integration of new AI models

## Project Constraints & Focus

### Current Scope (MVP)

- **Static Images Only:** No video generation, transitions, or animations
- **5-Slide Format:** Fixed carousel structure
- **Single Account Testing:** Initial implementation on one account
- **Manual Approval:** Human-in-the-loop for quality control

### Explicitly Excluded (Future Phases)

- **Video Generation:** Panning, zooming, or animated transitions
- **Advanced Analytics:** Competitor intelligence and content mutation
- **Voice-overs:** Audio content generation
- **Multi-platform:** Focus solely on TikTok initially

## Success Metrics

### Technical KPIs

- **Workflow Reliability:** 99%+ successful execution rate
- **Account Safety:** Zero restrictions or shadowbans
- **Content Quality:** Consistent visual and text quality
- **Scalability:** Successful multi-account deployment

### Business KPIs

- **Engagement Rates:** Measurable performance improvement
- **Content Volume:** Consistent daily production
- **Time Savings:** Significant manual work reduction
- **Account Growth:** Sustained follower and engagement increases

## Communication & Workflow

### Time Tracking

- **Method:** Upwork's built-in time tracker
- **Limit:** 40 hours/week maximum
- **Rate:** $25.00/hour

### Collaboration Tools

- **Primary:** Upwork messaging
- **Documentation:** Google Docs for proposals and planning
- **File Sharing:** Google Drive for assets and outputs
- **Approval Workflow:** Slack integration for real-time decisions

### Quality Assurance

- **100% Money-Back Guarantee:** For qualified clients
- **Performance Standards:** Minimum engagement commitments
- **Technical Support:** System monitoring and maintenance
- **Satisfaction Guarantee:** Complete project satisfaction requirement

## Important Notes

### Character Consistency Priority

- **Critical Success Factor:** Same person appearance across all generated selfies
- **Prompt Template:** Use consistent character description across all generations
- **Alternative Options:** If GPT-Image-1 can't achieve consistency, switch to Midjourney
- **Cost Consideration:** Lower price preferred if quality maintained

### Account Safety

- **Personal Accounts:** No Business API usage
- **Device Fingerprinting:** GeeLark protection features
- **Rate Limiting:** Intelligent posting patterns
- **Proxy Rotation:** Built-in security measures

### Content Compliance

- **Health Claims:** Appropriate and compliant messaging
- **Brand Consistency:** Maintain voice across all content
- **Cultural Sensitivity:** Ensure appropriate content for target audience
- **Platform Guidelines:** Full TikTok community standards compliance
