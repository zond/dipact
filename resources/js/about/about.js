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
                {faq.paragraphs.map((text) => (
                  // Use first 10 chars of paragraph as key to keep React happy. This will produce a
                  // console error if two paragraphs in the same FAQ start with the same first 10 chars
                  <MaterialUI.Typography key={text.slice(0, 10)}>
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
