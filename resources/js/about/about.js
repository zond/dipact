import * as helpers from "../helpers.js";
import { summary, faqs, header } from "./about.data.js";
import useStyles from "./about.styles.js";

const About = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MaterialUI.Container>
        <div className={classes.header}>
          <MaterialUI.Typography variant="h1">{header}</MaterialUI.Typography>
        </div>
        <div>
          <MaterialUI.Typography variant="body1" gutterBottom>
            {window.HTMLReactParser(summary)}
          </MaterialUI.Typography>
        </div>
        <MaterialUI.Typography variant="h3" className={classes.header}>FAQ</MaterialUI.Typography>
        {faqs.map((faq, index) => {
          return (
            <MaterialUI.Accordion key={faq.header}>
              <MaterialUI.AccordionSummary
                expandIcon={helpers.createIcon("\ue5cf")}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <MaterialUI.Typography variant='h4'>{faq.header}</MaterialUI.Typography>
              </MaterialUI.AccordionSummary>
              <MaterialUI.AccordionDetails className={classes.accordionDetails}>
                {faq.paragraphs.map((text, index) => (
                  <MaterialUI.Typography key={index}>
                    {window.HTMLReactParser(text)}
                  </MaterialUI.Typography>
                ))}
              </MaterialUI.AccordionDetails>
            </MaterialUI.Accordion>
          );
        })}
      </MaterialUI.Container>
    </div>
  );
};
export default About;
