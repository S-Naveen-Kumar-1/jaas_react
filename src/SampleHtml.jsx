import React, { useEffect, useState } from "react";
import { parseContentBlocks } from "./JsonFormatter";

export const SampleHtml = () => {
  const [jsonOutput, setJsonOutput] = useState([]);

  const bodyContent = `		<div class="heading-images-block">

			<!-- breadcrubbs content start -->
			<div class="content-blocks">
				<% if params[:controller].present? %>
				<% url = BLOG_BREADCRUMB_URL %>
				<% get_blog_breadcrumbs(params) %>
				<div class="aioseo-breadcrumbs">
					<% if params[:controller] == "blog_concepts" and @chapter_name.present? %>
					<span class="breadcrumb"><a href="<%= url %>math/<%=@chapter_url_name %>"><%=@chapter_name %></a></span>
					<span class="aioseo-breadcrumb-separator"><b style="font-size: 16px;"> > </b></span>
					<span class="breadcrumb"><%=@concept_name %></span>
					<% elsif params[:controller] == "blog_sub_concepts" and @chapter_name.present? %>
					<span class="breadcrumb"><a href="<%= url %>math/<%=@chapter_url_name %>"><%=@chapter_name %></a></span>
					<span class="aioseo-breadcrumb-separator"><b style="font-size: 16px;"> > </b></span>
					<span class="breadcrumb"><a href="<%= url %>math/<%=@chapter_url_name %>/<%=@concept_url_name %>"><%=@concept_name %></a></span>
					<span class="aioseo-breadcrumb-separator"><b style="font-size: 16px;"> > </b></span>
					<span class="breadcrumb"><a><%=@sub_concept_name %></a></span>
					<% elsif params[:controller] == "blog_sub_concepts" and @chapter_name.present? %>
					<span class="breadcrumb"><a href="<%= url %>math/<%=@chapter_url_name %>"><%=@chapter_name %></a></span>
					<span class="aioseo-breadcrumb-separator"><b style="font-size: 16px;"> > </b></span>
					<span class="breadcrumb"><a href="<%= url %>math/<%=@chapter_url_name %>/<%=@concept_url_name %>"><%=@concept_name %></a></span>
					<span class="aioseo-breadcrumb-separator"><b style="font-size: 16px;"> > </b></span>
					<span class="breadcrumb"><a href="<%= url %>math/<%=@chapter_url_name %>/<%=@concept_url_name %>/<%=@sub_concept_url_name %>"><%=@sub_concept_name %></a></span>
					<span class="aioseo-breadcrumb-separator"><b style="font-size: 16px;"> > </b></span>
					<span class="breadcrumb"><a><%=@tag_name %></a></span>
					<% elsif params[:controller] == "blog_math_calculator" and params[:action].present? %>
					<span class="breadcrumb"><a href="<%= url %>math/math-calculators">Math Calculators</a></span>
					<span class="aioseo-breadcrumb-separator"><b style="font-size: 16px;"> > </b></span>
					<span class="breadcrumb"><%= params[:action].gsub("_"," ").try(:capitalize) %></span>
					<% end %>
				</div>
				<% end %>
			</div>




			<div class="top_bookfreeclass_box">
				<div class="top_bookfreeclass_wrapper">


					<div class="top_left_image">
						<img src="/assets/blog_pages/Vector 23.png" class="top-heading-star-img"  width="51" height="56" alt="img not found">

						<img src="/assets/blog_pages/banner-image.png" class="top-heading-banner-img"  width="185" height="111"  alt="img not found">

						<img src="/assets/blog_pages/Union.png" class="top-heading-Union-img"  width="28" height="28" alt="img not found">

						<img src="/assets/blog_pages/Ellipse 68.png" class="top-heading-Ellipse1-img" width="13" height="13" alt="img not found">

						<img src="/assets/blog_pages/Ellipse 247.png" class="top-heading-Ellipse2-img"  width="35" height="43" alt="img not found">
					</div>
					<div class="top-heading-text">
						<h3 class="top_left_content"> Master <b>Math</b> <br> with <b> 1:1 Online Classes.</b> Learn from Experts!</h3>
						<img src="/assets/blog_pages/Ellipse-disc.png" class="top-heading-Ellipse-disc-img" width="35" height="34" alt="img not found">
						<!-- <div class="top_left_book-btn"> -->
							<form action="<%= BLOG_BREADCRUMB_URL %>mathclass" method="post">
								<input type="hidden" name="utm_source" value="blog">
								<input type="hidden" name="utm_medium" value="<%= @page_name if @page_name.present?%>">
								<input type="hidden" name="utm_campaign" value="organic">
								<button type="submit" class="book-free-btn" style="text-decoration: none; color: white; cursor: pointer;">Book a Free Class</button>
							</form>
						</div>
					</div>
				</div>


				<div class="title-heading"><h1 class="heading-name">
				Absolute Value Calculator</h1></div>
			</div>


			<div class=" middle-content">
				<div class="content-area" id="primary">

					<div class="block-wrapper-content">
                 <div class="content-blocks"> 
                   <p class="para_plus_wrapper">Absolute value of a given number is its distance from 0. The number can be positive or negative. Use this calculator to find the absolute value of any given number.</p>
             </div>

						<div class="content-blocks iframe-calculator-class">
							<div id="ggb-applet"></div>
						</div>

             <!-- <div class="content-blocks">
                <iframe scrolling="no" title="Prime Number Calculator New" src="https://www.geogebra.org/material/iframe/id/wt2axjtt/width/1100/height/1000/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false" width="70%" height="400px" class="prime-number-iframe"> </iframe>
            </div> -->
            <div class="content-blocks"> 
            	<h2 class="heading_plus_wrapper" >How to use the absolute value calculator?</h2>
            	<p class="para_plus_wrapper"><b>Step 1 : </b> Enter the number.</p>
            	<p class="para_plus_wrapper"><b>Step 2 : </b> Click the calculate button.
            	</p>
            	<p class="para_plus_wrapper"><b>Step 3 : </b> If you want to view the calculation then click on the Show Solution checkbox
           	</p> 
            	<p class="para_plus_wrapper">On clicking the Convert button, the absolute value will be shown.</p> 
                 </div>

            
            
				 <div class="content-blocks-childs">
            	<div class="solved-example-block">
            		<h2 class="heading_plus_wrapper" id="topic23">Examples to try for the calculation of the absolute value
            		</h2>
            		<div class="solved-example-card">
            			<h3 class="solved-example-questions">Calculate the absolute value of 10</h3>
            			<div  class="solved-example-answers">
            				<p class="span-solution-equation">
            					<b class="solved-equation">Solution : </b> 
            					<span class="span-solution">
            					<span class="math-feild">|\text {x} | =\text {x} \text{, for } \text {x} \geq 0</span><br><span class="math-feild" >|\text {-x} | = -(- \text {x} ), \text{ for } \text {x} < 0 </span><br>|10| = 10
            				</span>
            			</p>
            		</div>

            		
            	</div>
            	            	<div class="solved-example-card">
            		<h3 class="solved-example-questions">Calculate the absolute value of -50</h3>
            		<div  class="solved-example-answers">
            			<p class="span-solution-equation">
            				<b class="solved-equation">Solution : </b> 
            				<span class="span-solution">
            					<span class="math-feild">|\text {x} | =\text {x} \text{, for } \text {x} \geq 0</span><br><span class="math-feild" >|\text {-x} | = -(- \text {x} ), \text{ for } \text {x} < 0 </span><br>|-50| = 50
            				</span>
            				</p>
            			</div>
            		</div>														
            	</div>

            	<div class="content-blocks"> 
                <p class="para_plus_wrapper">An absolute value calculator is a tool that can be used to determine the absolute value of a number. The absolute value of a number is the distance that number is from zero, regardless of whether the number is positive or negative. In other words, it is the value of a number without any sign. The absolute value of a number is always positive, and it is represented by vertical bars surrounding the number. For example, the absolute value of -5 is written as | -5 |, and it is equal to 5.</p>
                 <p class="para_plus_wrapper">There are several reasons why you might need to calculate absolute values. For example, if you are working with algebraic equations, you may need to calculate absolute values in order to simplify the equation or solve for a variable. In geometry, absolute values are often used to calculate distances between points on a coordinate plane. Additionally, absolute values can be used in physics, engineering, and many other fields.</p>
                  <p class="para_plus_wrapper">To use an absolute value calculator, simply enter the number whose absolute value you want to calculate into the calculator. The calculator will then provide you with the absolute value of that number. Most calculators can handle both positive and negative numbers, and they will provide you with the correct result regardless of the input.</p>
                   <p class="para_plus_wrapper">If you don’t have access to an online calculator or prefer to do the calculation manually, there are several methods you can use to calculate absolute values. One method is to simply remove the negative sign from a negative number. For example, to calculate the absolute value of -7, you would remove the negative sign and be left with 7.</p>
                   <p class="para_plus_wrapper">Another method is to use a number line. A number line is a line that represents all the possible values of a number, with zero in the center. To calculate the absolute value of a number, simply find that number on the number line and count the number of units it is from zero. For example, to calculate the absolute value of -3, you would find -3 on the number line and count three units to the right to reach 3.</p>
                    <p class="para_plus_wrapper">When calculating the absolute value of a number, it’s important to remember that the result will always be positive. This is because the absolute value represents the distance a number is from zero, and distances are always positive values. If you try to calculate the absolute value of a positive number, you will simply get the same number as the result.</p>
                     <p class="para_plus_wrapper">In conclusion, an absolute value calculator is a useful tool for anyone who needs to calculate absolute values quickly and accurately. Whether you are working with algebraic equations, geometry problems, or any other type of calculation that requires absolute values, an online calculator or manual calculation method can help you get the correct result. By understanding the concept of absolute value and how to calculate it, you can expand your mathematical skills and make your work in many different fields easier and more efficient.</p> 
            		</div>														
              
            </div> 


        </div>`;
  useEffect(() => {
    const jsonOutput = parseContentBlocks(bodyContent);
    setJsonOutput(jsonOutput);
  }, []);
  return (
    <div>
      <h1>Parsed JSON Output</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f0f0f0",
          padding: "10px",
        }}
      >
        {JSON.stringify(jsonOutput, null, 2)}
      </pre>
    </div>
  );
};
