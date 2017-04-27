
/* global __utils__: false */

var fs = require( 'fs' );
var currentFile = require( 'system' ).args[3];
var curFilePath = fs.absolute( currentFile ).split( '/' );
while ( curFilePath[curFilePath.length - 1] !== 'test' ) {
	curFilePath.pop();
}
fs.changeWorkingDirectory( curFilePath.join( '/' ));

var casper = require( './initCasper.js' );
var config = casper.config;

var postSelector = 'table.wp-list-table.posts tr.type-glossary';
var postsCount;
var articles = [
	{
		title: 'Hezhou language',
		content: `<p><b>Hezhou</b> (Chinese 河州话 <i>Hezhouhua</i>) is a creolized <a href="/wiki/Mixed_language" title="Mixed language">mixed language</a> spoken in <a href="/wiki/Gansu_Province" class="mw-redirect" title="Gansu Province">Gansu Province</a>, China. It has been the lingua franca of <a href="/wiki/Linxia_Hui_Autonomous_Prefecture" title="Linxia Hui Autonomous Prefecture">Linxia</a> (formerly Hezhou) for several centuries. It is based on Uyghur and perhaps <a href="/wiki/Salar_language" title="Salar language">Salar</a>. It has been <a href="/wiki/Relexified" class="mw-redirect" title="Relexified">relexified</a> by Mandarin Chinese, so that nearly all roots are of Chinese origin, but grammatically it remains a Turkic language, with six <a href="/wiki/Noun_case" class="mw-redirect" title="Noun case">noun cases</a>, <a href="/wiki/Agglutinative" class="mw-redirect" title="Agglutinative">agglutinative</a> morphology and an <a href="/wiki/Subject%E2%80%93object%E2%80%93verb" title="Subject–object–verb">SOV</a> word order. Grammatical suffixes are either Turkic or Chinese in origin; in the latter case they have been divorced from their original function and bear little to no relation to Chinese semantics. The phonology is largely Chinese, with three tones, though Hezhou <a href="/wiki/Tone_sandhi" title="Tone sandhi">tone sandhi</a> is unusual from a Chinese perspective.<sup id="cite_ref-Mei_2-0" class="reference"><a href="#cite_note-Mei-2">[2]</a></sup> It may be that Hezhou tone differs between ethnic Chinese, <a href="/wiki/Hui_people" title="Hui people">Hui</a>, <a href="/wiki/Dongxiang_people" class="mw-redirect" title="Dongxiang people">Dongxiang</a> and <a href="/wiki/Bonan_people" title="Bonan people">Bao'an</a> speakers, though there is no indication that such differences occur among native speakers.<sup id="cite_ref-3" class="reference"><a href="#cite_note-3">[3]</a></sup></p>
<p>Hezhou was once thought to be a Chinese language that had undergone heavy Turkic influence with an ongoing loss of tone; it is now believed to be the opposite, with tone acquisition perhaps ongoing.<sup id="cite_ref-Mei_2-1" class="reference"><a href="#cite_note-Mei-2">[2]</a></sup></p>`,
	},
	{
		title: 'Tropic (Josep Renau)',
		content: `<p><i><b>Tropic</b></i> or <i><b>Trópico</b></i> is a 1945 painting by Spanish artist <a href="/wiki/Josep_Renau" title="Josep Renau">Josep Renau</a>. Renau executed the painting during his exile in México, while he collaborated with Mexican muralist painters such as <a href="/wiki/David_Alfaro_Siqueiros" title="David Alfaro Siqueiros">David Alfaro Siqueiros</a>.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1">[1]</a></sup> The painting represents a landscape, probably a Mexican natural space. Three vultures surround a fish skeleton on the lower right side of an uninhabited landscape. The scene evokes the desolation and destruction of humankind provoked by the wars of the 20th century, in the precise year of the end of World War II, which left a death toll of 60 million people.</p>
<p><i>Tropic</i> is Renau's personal response to the grief and mourning provoked by the Spanish Civil War and World War II. The painting is one of the most important and influential works by the artist. Renau depicts a landscape with the plastic means of the Escuela de Vallecas, a group of modern Spanish painters pursuing the representation of the Castilian topography as a ruthless land. Both this reference to the Spanish art of the 1930s and the vultures eating carrion as an allegory of modern wars give this painting a deep sense of melancholy and tragedy. In this work, Renau advances the presence of skulls that Picasso used recurrently after 1945 to express the trauma of World War II and his experience in the Paris of the German Occupation.</p>
<p>Renau reacts to the trauma of war with angular shapes and expressionistic brushstrokes that remain close to the language of Picasso's <i><a href="/wiki/Guernica_(Picasso)" title="Guernica (Picasso)">Guernica</a></i> and Joan Miró's <i><a href="/wiki/The_Reaper_(Mir%C3%B3_painting)" title="The Reaper (Miró painting)">The Reaper</a>,</i> two large-format paintings conceived for the Spanish Pavilion in the <a href="/wiki/Exposition_Internationale_des_Arts_et_Techniques_dans_la_Vie_Moderne" title="Exposition Internationale des Arts et Techniques dans la Vie Moderne">Exposition Internationale des Arts et Techniques dans la Vie Moderne</a> (Paris International Exposition) in the 1937 World's Fair in Paris. Renau played a crucial role in the gestation of the Spanish Pavilion; he was responsible for Picasso's participation<sup id="cite_ref-2" class="reference"><a href="#cite_note-2">[2]</a></sup> and executed a series of photomurals that covered the exterior of the building designed by <a href="/wiki/Josep_Llu%C3%ADs_Sert" title="Josep Lluís Sert">Josep Lluis Sert</a> and Luis Lacasa.<sup id="cite_ref-3" class="reference"><a href="#cite_note-3">[3]</a></sup></p>
<h2><span class="mw-headline" id="History">History</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Tropic_(Josep_Renau)&amp;action=edit&amp;section=1" title="Edit section: History">edit</a><span class="mw-editsection-bracket">]</span></span></h2>
<p>Renau considered this work one of the most important pieces in his personal collection and took the painting with him when he left México for East Berlin in 1958. Since 1976, the painting was in the collection of Manfred Schmidt, Germany. As for 2016, it is owned by a private collector in the United States, and is on long-term loan to the <a href="/wiki/Museo_Nacional_Centro_de_Arte_Reina_Sof%C3%ADa" title="Museo Nacional Centro de Arte Reina Sofía">Museo Reina Sofía</a> in Madrid,<sup id="cite_ref-4" class="reference"><a href="#cite_note-4">[4]</a></sup> where it can be seen together with Picasso's <i><a href="/wiki/Guernica_(Picasso)" title="Guernica (Picasso)">Guernica</a></i> in gallery 206.<sup id="cite_ref-5" class="reference"><a href="#cite_note-5">[5]</a></sup></p>`,
	},
	{
		title: 'Lancaster High School (Virginia)',
		content: `<p><b>Lancaster High School</b> is located in <a href="/wiki/Lancaster_County,_Virginia" title="Lancaster County, Virginia">Lancaster County</a> in the <a href="/wiki/Northern_Neck" title="Northern Neck">Northern Neck</a> of <a href="/wiki/Virginia" title="Virginia">Virginia</a>. The school is the only high school in the division and has a student population of 87. It has a faculty of 37 teachers, 1 librarian, 1 administrative assistant, and 1 principal. This is an 1A school and the teachers are exceptional. Lancaster High school has an exceptional environment and is always welcoming to new students.</p>`,
	},
	{
		title: 'Coral Springs Covered Bridge',
		content: `<p>The <b>Coral Springs Covered Bridge</b> is a 40&nbsp;ft <a href="/wiki/Covered_bridge" title="Covered bridge">covered bridge</a> located in <a href="/wiki/Coral_Springs,_Florida" title="Coral Springs, Florida">Coral Springs, Florida</a> and was the first permanent structure built in the city. The only publicly accessible covered bridge in Florida, it has also been honored with a <a href="/wiki/Florida_Heritage_Landmark" title="Florida Heritage Landmark">Florida Heritage Site Marker</a>.</p>
<h2><span class="mw-headline" id="Structure_and_design">Structure and design</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Coral_Springs_Covered_Bridge&amp;action=edit&amp;section=1" title="Edit section: Structure and design">edit</a><span class="mw-editsection-bracket">]</span></span></h2>
<p>It was designed by George Hodapp and constructed in early 1964 by Lewie Mullins, and George Porter, all Coral Ridge Properties employees. The 40-foot bridge has a single steel span that crosses N.W. 95th Avenue just south of Wiles Road.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1">[1]</a></sup> Its roof is composed of 25 truss rafters, cross braces and stringers and is covered with shingles.<sup id="cite_ref-2" class="reference"><a href="#cite_note-2">[2]</a></sup></p>
<p>Originally painted barn red, James S. Hunt, president of <a href="/wiki/WCI_Communities" title="WCI Communities">Coral Ridge Properties</a>, wanted to convey a sense of the <a href="/wiki/Old_South" title="Old South">Old South</a> on the otherwise barren landscape. Hunt's vision for Coral Springs was of a totally planned "City in the Country" with brick colonial-style public buildings, boulevards planted with flowers and the Covered Bridge as its centerpiece.<sup id="cite_ref-covbridge_3-0" class="reference"><a href="#cite_note-covbridge-3">[3]</a></sup></p>
<h2><span class="mw-headline" id="History">History</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Coral_Springs_Covered_Bridge&amp;action=edit&amp;section=2" title="Edit section: History">edit</a><span class="mw-editsection-bracket">]</span></span></h2>
<p>James S. Hunt contacted the American Snuff Company in <a href="/wiki/Winston-Salem,_North_Carolina" title="Winston-Salem, North Carolina">Winston-Salem, North Carolina</a>, for <a href="/wiki/Chewing_tobacco" title="Chewing tobacco">chewing tobacco</a> designs to make the bridge appear more "seasoned". The company supplied two designs plus an artist to paint the murals. The Bull of the Woods logo on the east side of the bridge was first used in 1876. The Peach Snuff logo on the west side was created in 1950 to appeal to a broader female audience.<sup id="cite_ref-covbridge_3-1" class="reference"><a href="#cite_note-covbridge-3">[3]</a></sup></p>
<p>When the eye wall of <a href="/wiki/Hurricane_Cleo" title="Hurricane Cleo">Hurricane Cleo</a> passed over Coral Springs in August 1964, the bridge was left relatively undamaged.<sup id="cite_ref-covbridge_3-2" class="reference"><a href="#cite_note-covbridge-3">[3]</a></sup> In October 2005, <a href="/wiki/Hurricane_Wilma" title="Hurricane Wilma">Hurricane Wilma</a> passed over the city, and again the structure sustained little damage.</p>
<p>Over the years, the bridge and murals have been restored but are visibly abstruse as trees, (that were planted since after the opening) have grown along the sides of the road and canal. The bridge has the distinction of a <a href="/wiki/Florida_Heritage_Landmark" title="Florida Heritage Landmark">Florida Heritage Site Marker</a> in recognition of its architecture and historical significance to the state. The Covered Bridge is depicted in Coral Springs' city seal; it is the only covered bridge located on a public <a href="/wiki/Right-of-way_(transportation)" title="Right-of-way (transportation)">right-of-way</a> in the state of Florida.<sup id="cite_ref-4" class="reference"><a href="#cite_note-4">[4]</a></sup></p>`,
	},
	{
		title: 'Jürgen Grasmück',
		content: `
<p><b>Jürgen Grasmück</b> (Born 23. January 1940 in <a href="/wiki/Hanau" title="Hanau">Hanau</a>, <a href="/wiki/Hessen" class="mw-redirect" title="Hessen">Hessen</a>&nbsp;; Died 7. August 2007 <sup id="cite_ref-1" class="reference"><a href="#cite_note-1">[1]</a></sup> in <a href="/wiki/Altenstadt_(Hessen)" class="mw-redirect" title="Altenstadt (Hessen)">the Old City</a> ) was a German author of <a href="/wiki/Horror_fiction" title="Horror fiction">horror fiction</a> and <a href="/wiki/Science-Fiction" class="mw-redirect" title="Science-Fiction">science fiction</a> novels.</p>
<p>He wrote under the <a href="/wiki/Pseudonym" title="Pseudonym">pseudonyms</a> <i>Albert C. Bowles</i>, <i>Bert Floorman</i>, <i>YES Garett</i>, <i>JA Gorman</i>, <i>Jay Grams</i>, <i>Jürgen Grasse</i>, <i>YES Grouft</i>, <i>Jeff Hammon</i>, <i>Ron Kelly</i>, <i>Rolf Murat</i>, <i>Steve D. rock</i>, <i>Dan Shocker</i>, <i>Owen L. Todd</i> and <i>Henri Vadim.</i></p>
<p>He is best known for the series of horror fiction stories "Macabros" and "Larry Brent", which he wrote under the pen name Dan Shocker.<sup id="cite_ref-2" class="reference"><a href="#cite_note-2">[2]</a></sup> An episode of the radio adaption of his 'Larry Brent' stories (Episode 9, <i>Snakeheads of Dr. Gorgo</i>) was banned by <a href="/wiki/Censorship_in_Germany" title="Censorship in Germany">German censors</a> in 1984.</p>`,
	},
]

casper.start( config.test_site.site_url + '/wp-admin', function start() {
	this.fill( '#loginform', {
		log: config.test_site.login,
		pwd: config.test_site.password,
	}, true );
}).thenOpen( config.test_site.site_url + config.urls.glossary.list, function countPosts() {
	postsCount = this.evaluate( function countPostsEvaluate( postSelector ) {
		return __utils__.findAll( postSelector ).length;
	}, postSelector );
}).thenOpen( config.test_site.site_url + config.urls.glossary.new );
articles.forEach( function forEachArticle( article ) {
	casper.then( function createNewPost() {
		this.fill( '#post', {
			post_title: article.title,
			content:    article.content,
		});
	}).thenClick( '#publish', function submitNewPost() {
		var url = this.getCurrentUrl(),
			idMatch = url.match( /post=(\d+)/ );
		if ( !idMatch ) {
			console.error( 'Unable to retrieve new term id' );
			this.exit( 1 );
		}
	}).thenClick( '.wrap .page-title-action');
});
casper.thenOpen( config.test_site.site_url + config.urls.glossary.list ).then( function recountPosts() {
	var count = this.evaluate( function countPostsEvaluate( postSelector ) {
		return __utils__.findAll( postSelector ).length;
	}, postSelector );
	if ( postsCount + 5 !== count ) {
		console.error( 'Not all posts created' );
		this.exit( 1 );
	}
});

casper.run();
