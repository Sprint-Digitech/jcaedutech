const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/(home)/HomeComponent.js');
let content = fs.readFileSync(file, 'utf8');

const dynamicHero = `
<div className="custom-hero-banner" style={{
    position: 'relative',
    width: '100%',
    minHeight: '650px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    padding: '100px 0'
}}>
    <style dangerouslySetInnerHTML={{__html: \`
        .custom-hero-banner a:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .hero-slide {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-size: cover;
            background-position: center center;
            opacity: 0;
            transition: opacity 1s ease-in-out;
            z-index: 1;
        }
        .hero-slide.active {
            opacity: 1;
            z-index: 2;
        }
        .hero-content {
            position: relative;
            z-index: 3;
            max-width: 700px;
            margin-left: 5%;
            color: #ffffff;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out 0.3s;
        }
        .hero-slide.active .hero-content {
            opacity: 1;
            transform: translateY(0);
        }
        .hero-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0,0,0,0.3);
            z-index: 2;
        }
    \`}} />
    
    {heroSlides.map((slide, index) => (
        <div key={index} className={\`hero-slide \${index === heroSlide ? 'active' : ''}\`} style={{ backgroundImage: \`url(\${slide.bg})\` }}>
            <div className="hero-overlay"></div>
            <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 3 }}>
                <div className="hero-content">
                    <h1 style={{ fontFamily: '"GT Walsheim Pro", sans-serif', fontSize: '64px', fontWeight: 700, lineHeight: 1.1, marginBottom: '25px', color: '#ffffff' }}>
                        <span className="bottom-shape" style={{ position: 'relative', display: 'inline-block', fontWeight: 100 }}>{slide.thin}</span> <br/>
                        {slide.bold}
                    </h1>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px', lineHeight: 1.6, marginBottom: '45px', color: '#ffffff', opacity: 0.9 }}>
                        {slide.text}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <a href={slide.btn1.href} style={{
                            display: 'inline-block',
                            background: '#ffa84b',
                            color: '#fff',
                            padding: '13px 38px',
                            borderRadius: '5px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 500,
                            fontSize: '17px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}>{slide.btn1.text}</a>
                        <a href={slide.btn2.href} style={{
                            display: 'inline-block',
                            background: 'transparent',
                            color: '#fff',
                            border: '2px solid rgba(255,255,255,0.3)',
                            padding: '11px 40px',
                            borderRadius: '5px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 500,
                            fontSize: '17px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}>{slide.btn2.text}</a>
                    </div>
                </div>
            </div>
        </div>
    ))}
</div>
`;

const startStr = '<div className="custom-hero-banner"';
const endStr = '<section className="elementor-section elementor-top-section elementor-element elementor-element-7b78af84';

const beforePart = content.substring(0, content.indexOf(startStr));
const afterPart = content.substring(content.indexOf(endStr));

const bridgeStr = `
                        </div>
                </div>
                    </div>
        </div>
                    </div>
        </section>
`;

const newContent = beforePart + dynamicHero + bridgeStr + afterPart;

fs.writeFileSync(file, newContent);
console.log("Successfully animated the hero banner.");
