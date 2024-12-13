export function parseContentBlocks(htmlString) {
    console.log(htmlString)
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');


    console.log(doc)
    const contentBlocks = [
        ...Array.from(doc.querySelectorAll('.content-blocks')),
        ...Array.from(doc.querySelectorAll('.content-blocks1'))
    ];
    console.log(contentBlocks)
    const result = [];

    contentBlocks.forEach((block, blockIndex) => {
        let jsonObj = {};


        // Case 1: div with class="content-table-container" or ul tag with class="intersting-facts" (fixed typo)
        if (block.querySelector('.content-table-container') || block.querySelector('ul.interesting-facts')) {
            console.log("inside case 1")
            const ulTag = block.querySelector('ul');
            const title = block.querySelector('h2.sub_heading')?.textContent.trim();
            const values = ulTag
                ? Array.from(ulTag.querySelectorAll('li')).map((li) => {
                    const content = li.textContent.trim();
                    const topicId = li.getAttribute('onclick')?.match(/'([^']+)'/)[1]; // Extract topicId from the onclick attribute
                    return {
                        content,
                        topicId
                    };
                })
                : [];
            const imgTag = block.querySelector('img');
            const image = imgTag ? imgTag.getAttribute('src') : null;
            const alt = imgTag ? imgTag.getAttribute('alt') : null;
            jsonObj = {
                type: 'list',
                title,
                image,
                alt,
                values,
                sequence: blockIndex + 1,
            };
        }

        // Case 2: div contains table tag with class="sub-topics-table"
        else if (block.querySelector('table.sub-topics-table')) {
            console.log("inside case 2")

            const table = block.querySelector('table.sub-topics-table');
            const title = block.querySelector('h2.table-sub_heading')?.textContent.trim();
            const values = Array.from(table.querySelectorAll('tr')).map((tr) =>
                Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
            );

            jsonObj = {
                type: 'table',
                title,
                values,
                sequence: blockIndex + 1
            };
        }
        //  combined case 3 and case 5
        else if (block.querySelector('.content-blocks-childs') || block.querySelector('.solved-example-card')) {
            // Check if .content-blocks-childs contains a .solved-example-block
            console.log("inside case 3 and 5")

            const hasSolvedExampleBlock = block.querySelector('.content-blocks-childs .solved-example-block');
            const hasDirectSolvedExampleCard = block.querySelector('.solved-example-card');

            if (hasSolvedExampleBlock || hasDirectSolvedExampleCard) {
                console.log("inside case 5")

                // Case 5 logic
                const solvedExampleBlocks = hasSolvedExampleBlock
                    ? block.querySelectorAll('.content-blocks-childs .solved-example-block')
                    : [block]; // If direct cards are found, treat the block as the solved-example-block

                solvedExampleBlocks.forEach((solvedBlock, blockIndex) => {
                    const title = 'Solved examples';
                    const values = [];

                    // Iterate over each solved-example-card
                    Array.from(solvedBlock.querySelectorAll('.solved-example-card')).forEach((card, cardIndex) => {
                        // Extract the question
                        const question = card.querySelector('h3.solved-example-questions')?.textContent.trim();

                        // Extract options (li elements inside ol.solved-examples)
                        const options = Array.from(card.querySelectorAll('ol.solved-examples li')).map(li => li.innerHTML.trim());

                        // Extract solution (span inside div.solved-example-answers)
                        const solution = card.querySelector('div.solved-example-answers span.span-solution')?.innerHTML.trim();

                        // Only push valid data into the values array
                        if (question && options.length > 0 && solution) {
                            values.push({
                                question,
                                options,
                                solution,
                                sequence: cardIndex + 1
                            });
                        }
                    });

                    // Create the JSON object
                    const jsonObj = {
                        type: 'solved_examples',
                        title,
                        values,
                        sequence: blockIndex + 1
                    };

                    // Push the JSON object to the result array
                    result.push(jsonObj);
                });
            }
            else {
                console.log("inside case 3")

                // Case 3 logic
                const sections = block.querySelectorAll('.content-blocks-childs'); // Get all content-blocks-childs

                sections.forEach((section) => {
                    const titleElement = section.querySelector('.heading_plus_wrapper, .sub_heading');
                    const title = titleElement ? titleElement.textContent : '';
                    const id = titleElement ? titleElement.id : '';
                    const values = [];

                    // Loop through each child element inside the section
                    let sequence = 1;
                    section.childNodes.forEach((child) => {
                        if (child.nodeType === 1) { // Check if the node is an element
                            const tag = child.tagName.toLowerCase();
                            let content = null;
                            let image = null;

                            // Handle different tags (h2, h3, p, img)
                            if (tag === 'h2' || tag === 'h3' || tag === 'p') {
                                content = child.textContent.trim();
                            }

                            if (tag === 'img') {
                                image = child.getAttribute('src');
                            }

                            // Add the content to the values array if it's not null or undefined
                            if (content || image) {
                                values.push({
                                    tag: tag,
                                    sequence: sequence,
                                    content: content || null,
                                    image: image || null
                                });
                                sequence++;
                            }
                        }
                    });

                    // Create the JSON object for this section
                    const jsonObj = {
                        type: "para_sub_list",
                        title: title,
                        id: id,
                        values: values
                    };

                    // Push the JSON object to the result array
                    result.push(jsonObj);
                });
            }
        }

        // Case 3: div contains table tag with class="sub-topics-table"

        // else if (block.querySelector('.content-blocks-childs')) {
        //     const sections = block.querySelectorAll('.content-blocks-childs'); // Get all content-blocks-childs

        //     sections.forEach((section) => {

        //         const titleElement = section.querySelector('.heading_plus_wrapper, .sub_heading');
        //         const title = titleElement ? titleElement.textContent : '';
        //         const id = titleElement ? titleElement.id : '';
        //         const values = [];

        //         // Loop through each child element inside the section
        //         let sequence = 1;
        //         section.childNodes.forEach((child) => {
        //             if (child.nodeType === 1) { // Check if the node is an element
        //                 const tag = child.tagName.toLowerCase();
        //                 let content = null;
        //                 let image = null;

        //                 // Handle different tags (h2, h3, p, img)
        //                 if (tag === 'h2' || tag === 'h3' || tag === 'p') {
        //                     content = child.textContent.trim();
        //                 }

        //                 if (tag === 'img') {
        //                     image = child.getAttribute('src');
        //                 }

        //                 // Add the content to the values array if it's not null or undefined
        //                 if (content || image) {
        //                     values.push({
        //                         tag: tag,
        //                         sequence: sequence,
        //                         content: content || null,
        //                         image: image || null
        //                     });
        //                     sequence++;
        //                 }
        //             }
        //         });

        //         // Create the JSON object for this section
        //         const jsonObj = {
        //             type: "para_sub_list",
        //             title: title,
        //             id: id,
        //             values: values
        //         };

        //         // Push the JSON object to the result array
        //         result.push(jsonObj);
        //     });
        // }

        // Case 6: div contains table tag with class=".faq-section"

        else if (block.querySelector('.faq-section')) {
            console.log("inside case 6")

            // Select the main content block



            // Extract the main FAQ title (h2)
            const mainTitle = block.querySelector('h2.FAQ-heading').textContent.trim();

            // Find the FAQ accordion inside content-blocks1
            const faqAccordion = block.querySelector('#faq-accordion');

            // Initialize an array to hold the FAQ data
            const faqData = [];

            // Select all FAQ items inside the accordion
            const faqItems = faqAccordion.querySelectorAll('.card');

            // Loop through each FAQ item and extract the question and answer
            faqItems.forEach((item) => {
                const faqTitle = item.querySelector('.card-header h3').textContent.trim(); // Extract FAQ title (question)
                const faqAnswer = item.querySelector('.card-body p').textContent.trim(); // Extract FAQ answer
                const cleanedFaqAnswer = faqAnswer.replace(/\\\"/g, '"').replace(/\\\\/g, '\\'); // Clean up escaped quotes and backslashes
                // Push each FAQ as an object to the faqData array
                faqData.push({
                    faqtitle: faqTitle,
                    faqanswer: cleanedFaqAnswer
                });
            });

            // Create the final JSON structure
            jsonObj = {
                type: "faq_data",
                title: mainTitle,
                values: faqData
            }
        }


        // Case 7: div contains table tag with class=".absolute-icons-blocks"

        else if (block.querySelector('.absolute-icons-blocks')) {
            console.log("inside case 7")


            jsonObj = {

                type:"Did You Know"
            };

            const absoluteIconsBlock = block.querySelector('.absolute-icons-blocks');
            if (absoluteIconsBlock) {
                const images = [];
                const imageElements = absoluteIconsBlock.querySelectorAll('img');
                imageElements.forEach((img) => {
                    images.push(img.getAttribute('src')); // Add image src to the images array
                });
                jsonObj.images = images; // Store images in the JSON object
            }

            // Check if the "facts_section" exists and extract title and content
            const factsSection = block.querySelector('.facts_section');
            if (factsSection) {
                const title = factsSection.querySelector('.heading-facts-text').textContent.trim(); // Extract title from h3
                const content = factsSection.querySelector('.did_you_know_tex').textContent.trim(); // Extract content from p
                jsonObj.facts = {
                    title: title,
                    content: content
                }; // Store facts in the JSON object
            }

            // Log the resulting JSON structure

        }
        // Case 4: div does not contain table tag or ul tag (for paragraphs and images)
        else if (!block.querySelector('table') && !block.querySelector('ul')) {
            console.log("inside case 4")

            const title = block.querySelector('h2.heading_plus_wrapper')?.textContent.trim() || null;
            const id = block.querySelector('h2.heading_plus_wrapper')?.id || null;
            const values = [];
            let pSequence = 1;  // Initialize the p tag sequence counter

            Array.from(block.children).forEach((element, seq) => {
                if (element.classList.contains('para_plus_wrapper') || element.tagName === 'IMG') {
                    if (element.tagName === 'P') { // Only increment sequence for <p> tags
                        const cleanContent = element.textContent.trim().replace(/\s+/g, ' '); // Clean up unwanted whitespace

                        values.push({
                            tag: element.tagName.toLowerCase(),
                            sequence: pSequence++, // Increment sequence for <p> tags
                            content: cleanContent,  // Use cleaned content
                            image: null
                        });
                    } else if (element.tagName === 'IMG') {
                        values.push({
                            tag: element.tagName.toLowerCase(),
                            sequence: null, // No sequence for image
                            content: null,
                            image: element.getAttribute('src')
                        });
                    }
                }
            });

            jsonObj = {
                type: 'para',
                id,
                title,
                sequence: blockIndex + 1,
                values,
            };
        }
        // Case 5: div contains class="solved-example-block"
        // else if (block.classList.contains('solved-example-block')) {
        //     const title = 'Solved examples';
        //     const values = [];

        //     // Iterate over each solved-example-card
        //     Array.from(block.querySelectorAll('.solved-example-card')).forEach((card, cardIndex) => {
        //         // Extract the question
        //         const question = card.querySelector('h3.solved-example-questions')?.textContent.trim();
        //         console.log("Question found:", question); // Debugging log

        //         // Extract options (li elements inside ol.solved-examples)
        //         const options = Array.from(card.querySelectorAll('ol.solved-examples li')).map(li => li.innerHTML.trim());
        //         console.log("Options found:", options); // Debugging log

        //         // Extract solution (span inside div.solved-example-answers)
        //         const solution = card.querySelector('div.solved-example-answers span.span-solution')?.innerHTML.trim();
        //         console.log("Solution found:", solution); // Debugging log

        //         // Only push valid data into the values array
        //         if (question && options.length > 0 && solution) {
        //             values.push({
        //                 question,
        //                 options,
        //                 solution,
        //                 sequence: cardIndex + 1
        //             });
        //         }
        //     });

        //     // Check if values array is populated
        //     console.log("Values array:", values);

        //     // Create the JSON object
        //     jsonObj = {
        //         type: 'solved_examples',
        //         title,
        //         values,
        //         sequence: blockIndex + 1
        //     };
        // }



        // Case 5: div contains class=".content-blocks1"







        result.push(jsonObj);
    });

    return result;
}
