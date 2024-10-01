import FeatureSectionImg1 from './assets/FeatureSectionImg1.png';
import FeatureSectionImg2 from './assets/FeatureSectionImg2.png';
import FeatureSectionImg3 from './assets/FeatureSectionImg3.png';
import FeatureSectionImg4 from './assets/FeatureSectionImg4.png';

export const featuresData = [
  {
    title: "Rapid API Generation",
    description:
      "Mercury.js simplifies backend service development by generating Mongoose models, CRUD operations, GraphQL typedefs, and resolvers from a JSON model.",
    imageSrc: FeatureSectionImg1,
    imageAlt: "Rapid API Generation",
    reverse: false,
  },
  {
    title: "Advanced Access Control",
    description:
      "With Mercury.js, you can define field-level and operation-level permissions, ensuring robust access control for your data.",
    imageSrc: FeatureSectionImg2,
    imageAlt: "Advanced Access Control",
    reverse: true,
  },
  {
    title: "Seamless Integration",
    description:
      "Easily integrate Mercury.js with your preferred frameworks like Next.js and Express, and start building your API backend in no time.",
    imageSrc: FeatureSectionImg3,
    imageAlt: "Seamless Integration",
    reverse: false,
  },
  // {
  //   title: "Custom Hooks",
  //   description:
  //     "Implement custom logic before or after certain operations on your models using Mercury.js's powerful hook system.",
  //   imageSrc: FeatureSectionImg4,
  //   imageAlt: "Custom Hooks",
  //   reverse: true,
  // },
];
