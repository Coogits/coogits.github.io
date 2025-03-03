
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

    mermaid.initialize({
        startOnLoad: true,
        themeVariables: {
            fontSize: '12px',
            nodePadding: '1px',
            edgeSpacing: '1px',
            nodeSpacing: '1px',
            rankSpacing: '1px',
            clusterBkg: '#d0d0d0',
            clusterBorder: '#505050',
        },
        flowchart: {
            curve: 'linear',
            nodePadding: '1px',
            edgeSpacing: '1px',
            nodeSpacing: '1px',
            rankSpacing: '1px'
        }
    });

    function activateLinks() {
        setTimeout(() => {
            document.querySelectorAll('g[class*="link:"]').forEach(node => {
                node.classList.forEach(className => {
                    if (className.startsWith('link:')) {
                        let url = className.split(':')[1]; // Extract URL
                        if (!url) return;

                        // Ensure internal links are handled properly
                        if (!url.startsWith('http') && !url.startsWith('/')) {
                            url = '/' + url; // Force internal paths to start with '/'
                        }

                        if (url === "/Content/index") {
                            url = "/"; // Handle index separately
                        }

                        // Prevent multiple event listeners
                        if (!node.dataset.linkActivated) {
                            node.dataset.linkActivated = "true";
                            node.style.cursor = "pointer";

                            node.addEventListener('mousedown', (event) => {
                                if (event.button === 0) {
                                    window.location.href = url; // Left click  same tab
                                } else if (event.button === 1) {
                                    event.preventDefault();
                                    window.open(url, '_blank'); // Middle click  new tab
                                }
                            });

                            // Handle touch events (for mobile)
                            node.addEventListener('touchstart', () => {
                                window.location.href = url;
                            });
                        }
                    }
                });
            });
            // Internal links (links with 'internal-link' class)
            document.querySelectorAll('g[class*="internal-link"]').forEach(node => {
                node.classList.forEach(className => {
                    if (className === 'internal-link') {
                        const label = node.querySelector('text') ? node.querySelector('text').textContent : '';
                        let internalUrl = `/Content/${label.replace(/\s+/g, "-")}/`; // Replace spaces with underscores
                        if (label === "Home") {
                            internalUrl = "/";
                        }
                        if (!node.dataset.linkActivated) {
                            node.dataset.linkActivated = "true";
                            node.style.cursor = "pointer";
                            node.addEventListener('mousedown', (event) => {
                                // Handle left click (opens in same tab)
                                if (event.button === 0) {
                                    console.log(`Opening internal link: ${internalUrl}`);
                                    window.location.href = internalUrl; // Open in same tab
                                }
                                // Handle middle click (opens in new tab)
                                if (event.button === 1) {
                                    console.log(`Opening internal link: ${internalUrl}`);
                                    window.open(internalUrl, '_blank'); // Open in new tab
                                }
                            });
                        }
                    }
                });
            });
        }, 500); // Delay to ensure Mermaid rendering is done

    }

    function renderMermaid() {
        mermaid.run().then(() => {
            activateLinks();
        });
    }

    window.addEventListener('load', renderMermaid);