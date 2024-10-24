
# WhisperBox 🎤💬

WhisperBox is a modern and sleek anonymous feedback and Q&A platform, inspired by "Not Gonna Lie" (NGL). It enables users to create a unique link where others can send anonymous messages, feedback, or questions, making it perfect for influencers, content creators, or anyone looking to engage anonymously with their audience.

## Features ✨

- **Anonymous Messaging**: Create a link to share with your audience where they can send you anonymous feedback or questions.
- **Customizable Sharing**: Users can share messages with a custom gradient background as an image, perfect for social media platforms like Instagram.
- **Dashboard**: Manage and respond to received messages directly from your personal dashboard.
- **Secure Authentication**: Supports authentication via Google, GitHub, and traditional email sign-up/sign-in using NextAuth.
- **Real-time Updates**: Messages appear instantly on your dashboard.
- **Responsive UI**: Fully responsive, optimized for mobile and desktop users.

## Tech Stack 🛠️

- **Frontend**
- **Authentication**
- **Database**
- **NEXT AUTH**
- **ZOD**
- **Shad-CN**
- **Deployment**
- **Styling**
- **Form Validation**

## Screenshots 📸

| Feature          | Screenshot |
|------------------|------------|
| Dashboard        | ![Dashboard](https://res.cloudinary.com/dhvkjanwa/image/upload/v1729522297/Screenshot_2024-10-21_at_20-16-41_Whisper-Box_qbhfss.png) |
| Anonymous Message | ![Anonymous Message](https://res.cloudinary.com/dhvkjanwa/image/upload/v1729522297/Screenshot_2024-10-21_at_20-18-48_Whisper-Box_db1htk.png) |
| Message Share    | ![Message Share](https://res.cloudinary.com/dhvkjanwa/image/upload/v1729522297/Screenshot_2024-10-21_at_20-16-59_Whisper-Box_aumtll.png) |
| Home     | ![Share MSG](https://res.cloudinary.com/dhvkjanwa/image/upload/v1729522298/Screenshot_2024-10-21_at_20-13-54_Whisper-Box_i96jpu.png) |
| Share MSG IMG     | ![Share MSG](https://res.cloudinary.com/dhvkjanwa/image/upload/v1729522297/Screenshot_2024-10-21_at_20-16-59_Whisper-Box_aumtll.png) |

## Getting Started 🚀

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 14.x)
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- Vercel account for deployment

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bhanupratapsingh21/Whisper-BOX
   cd 
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**: Create a `.env` file in the root of the project and add your credentials:
   ```bash
  MONGODBURI=
  DBNAME=
  NEXTAUTH_SECRET=
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  GITHUB_APP_CLIENT_ID=
  GITHUB_APP_CLIENT_SECRET=
  GIMINI_API_KEY=
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Deployment

1. **Deploy on Vercel**:
   - Push your code to GitHub.
   - Head to [Vercel](https://vercel.com), import the project, and deploy.
   - Set up the environment variables in Vercel dashboard under **Project Settings**.

## Contributing 🤝

Feel free to fork this repository and submit pull requests. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

If you have any questions or suggestions, feel free to reach out:

---
