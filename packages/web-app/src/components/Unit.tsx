import { UnitDisplay } from "@diplicity/common";
import { Card, CardContent, Typography } from "@material-ui/core";

const Unit = ({
  type,
  color,
  dislodged,
}: UnitDisplay & { dislodged?: boolean }) => {
  return (
    <Card>
      <CardContent>
        <Typography>Type: {type}</Typography>
        <Typography>Dislodged: {Boolean(dislodged).toString()}</Typography>
        <Typography>Color: {color}</Typography>
      </CardContent>
    </Card>
  );
};

export default Unit;