type RecruitmentImage = {
  alt: string;
  blurDataURL?: string;
  src: string;
};

type RecruitmentConfig = {
  closedImage: RecruitmentImage;
  isRecruitmentOpen: boolean;
  openImage: RecruitmentImage;
  recruitmentFormUrl: string;
};

export const recruitmentConfig: RecruitmentConfig = {
  isRecruitmentOpen: false,
  recruitmentFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSfwcHf9qlp82zL6ozTGCwcedqiVyZPMbfV5QdVsvk-8K2bcWA/viewform?usp=dialog",
  openImage: {
    src: "/images/recruitment/true.webp",
    alt: "MUAS members carrying an aircraft during a flight day",
  },
  closedImage: {
    src: "/images/recruitment/false-updated.webp",
    alt: "MUAS team members wearing team polos",
    blurDataURL:
      "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAwCdASoYABAAPwFsrU6rJiQiMAgBYCAJYwCdABQfPMMvV/wEFWVwANZ8zk9LqMtbhkP3Y9KyINQacNxMF1dVwfXgAA==",
  },
};
