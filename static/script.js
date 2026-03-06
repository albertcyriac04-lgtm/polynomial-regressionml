/**
 * PolyPredict — Frontend JavaScript
 * Handles prediction form submission, slider sync, and result display.
 */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("predict-form");
    const inputField = document.getElementById("experience-input");
    const slider = document.getElementById("experience-slider");
    const predictBtn = document.getElementById("predict-btn");
    const btnText = predictBtn.querySelector(".btn-text");
    const btnLoader = predictBtn.querySelector(".btn-loader");
    const btnArrow = predictBtn.querySelector(".btn-arrow");
    const resultContainer = document.getElementById("result-container");
    const resultValue = document.getElementById("result-value");
    const resultMeta = document.getElementById("result-meta");
    const errorContainer = document.getElementById("error-container");
    const errorText = document.getElementById("error-text");

    // ─── Sync slider ↔ input ───────────────────────────
    slider.addEventListener("input", () => {
        inputField.value = slider.value;
    });

    inputField.addEventListener("input", () => {
        const val = parseFloat(inputField.value);
        if (!isNaN(val) && val >= 0 && val <= 30) {
            slider.value = val;
        }
    });

    // ─── Form Submit ───────────────────────────────────
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const experience = parseFloat(inputField.value);
        if (isNaN(experience) || experience < 0) {
            showError("Please enter a valid number of years (≥ 0).");
            return;
        }

        // UI: loading state
        setLoading(true);
        hideError();
        hideResult();

        try {
            const response = await fetch("/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ experience }),
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.error || "Something went wrong.");
                return;
            }

            showResult(data.predicted_salary, experience);
        } catch (err) {
            showError("Unable to reach the server. Please try again.");
        } finally {
            setLoading(false);
        }
    });

    // ─── UI Helpers ────────────────────────────────────
    function setLoading(isLoading) {
        predictBtn.disabled = isLoading;
        btnText.style.display = isLoading ? "none" : "inline";
        btnArrow.style.display = isLoading ? "none" : "inline";
        btnLoader.style.display = isLoading ? "inline-flex" : "none";
    }

    function showResult(salary, years) {
        resultContainer.style.display = "block";
        resultMeta.textContent = `Based on ${years} year${years !== 1 ? "s" : ""} of experience`;

        // Animate salary number counting up
        animateValue(resultValue, 0, salary, 800);
    }

    function hideResult() {
        resultContainer.style.display = "none";
    }

    function showError(message) {
        errorContainer.style.display = "flex";
        errorText.textContent = message;
    }

    function hideError() {
        errorContainer.style.display = "none";
    }

    /**
     * Animate a number from start to end inside an element.
     */
    function animateValue(el, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;

            el.textContent = "$" + Math.round(current).toLocaleString("en-US");

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ─── Navbar Scroll Effect ──────────────────────────
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar");
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.style.background = "rgba(10, 10, 15, 0.9)";
        } else {
            navbar.style.background = "rgba(10, 10, 15, 0.7)";
        }

        lastScroll = currentScroll;
    });
});
