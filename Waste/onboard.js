
    const onboardingData = [
      {
        title: "Welcome!",
        description: "Let's make your city cleaner and greener together.",
        image: "waste.png",
      },
      {
        title: "Segregate Waste",
        description: "Separate biodegradable and non-biodegradable waste to promote recycling.",
        image: "waste1.jpg3",
      },
      {
        title: "Earn Rewards",
        description: "Get rewarded for contributing to a cleaner environment!",
        image: "waste.png",
      }
    ];

    let currentStep = 0;

    const titleEl = document.querySelector("h1 span");
    const descEl = document.querySelector("p");
    const imageEl = document.getElementById("onboarding-image");
    const dots = document.querySelectorAll(".dot");
    const nextBtn = document.querySelector(".next");
    const skipBtn = document.querySelector(".skip");

    function updateStep(index) {
      const step = onboardingData[index];

      imageEl.style.opacity = 0;

      setTimeout(() => {
        titleEl.textContent = step.title;
        descEl.textContent = step.description;
        imageEl.src = step.image;

        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
        });

        imageEl.style.opacity = 1;

        nextBtn.textContent = index === onboardingData.length - 1 ? "Finish" : "Next";
      }, 300);
    }

    nextBtn.addEventListener("click", () => {
      if (currentStep < onboardingData.length - 1) {
        currentStep++;
        updateStep(currentStep);
      } else {
        alert("Onboarding Complete!");
      }
    });

    skipBtn.addEventListener("click", () => {
      alert("Onboarding Skipped!");
    });

    window.onload = () => {
      updateStep(currentStep);
    };
 