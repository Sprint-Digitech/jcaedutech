const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/(home)/HomeComponent.js');
let content = fs.readFileSync(file, 'utf8');

// The replacement hero block
const newHero = `
<div className="custom-hero-banner" style={{
    position: 'relative',
    width: '100%',
    minHeight: '650px',
    backgroundImage: 'url(/wp-content/uploads/2025/05/Banner-new-2-1.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    display: 'flex',
    alignItems: 'center',
    padding: '100px 0'
}}>
    <style dangerouslySetInnerHTML={{__html: \`
        .custom-hero-banner a:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
    \`}} />
    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '700px', marginLeft: '5%', color: '#ffffff' }}>
            <h1 style={{ fontSize: '64px', fontWeight: 700, lineHeight: 1.1, marginBottom: '25px', color: '#ffffff' }}>
                <span className="bottom-shape" style={{ position: 'relative', display: 'inline-block' }}>Unlock Your</span> <br/>
                Financial Future
            </h1>
            <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '45px', color: '#ffffff', opacity: 0.9 }}>
                Master the stock market with expert-led, practical learning at <br/>
                <strong style={{ color: '#ffa84b', fontWeight: 600 }}>JCA Edutech.</strong>
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <a href="/courses" style={{
                    display: 'inline-block',
                    background: '#ffa84b',
                    color: '#fff',
                    padding: '15px 40px',
                    borderRadius: '5px',
                    fontWeight: 600,
                    fontSize: '16px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                }}>Start Learning Today</a>
                <a href="/courses" style={{
                    display: 'inline-block',
                    background: 'transparent',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.4)',
                    padding: '13px 40px',
                    borderRadius: '5px',
                    fontWeight: 600,
                    fontSize: '16px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                }}>Explore Our Courses</a>
            </div>
        </div>
    </div>
    <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1
    }}></div>
</div>

                        </div>
                </div>
                    </div>
        </div>
                    </div>
        </section>
`;

const startStr = '<div className="elementor-element elementor-element-3fa8482e elementor-widget elementor-widget-slider_revolution"';
const endStr = '<section className="elementor-section elementor-top-section elementor-element elementor-element-7b78af84';
const beforePart = content.substring(0, content.indexOf(startStr));
const afterPart = content.substring(content.indexOf(endStr));

const newContent = beforePart + newHero + afterPart;

fs.writeFileSync(file, newContent);
console.log("Successfully replaced Slider Revolution with static hero banner.");
