// mathjax-config.js
window.MathJax = {
    loader: { load: ['[tex]/colortbl'] },  // Explicitly load colortbl extension
    tex: {
        packages: { '[+]': ['colortbl'] }, // Enable colortbl package
        autoload: {
            colortbl: ['cellcolor', 'columncolor', 'rowcolor'] // Autoload color commands
        },
        inlineMath: [['$', '$'], ['\\(', '\\)']]
    }
        
};

// Dynamically load MathJax
(function() {
    let script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    document.head.appendChild(script);
})();
