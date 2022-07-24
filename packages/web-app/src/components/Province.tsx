import { ProvinceDisplay } from "@diplicity/common";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import Unit from "./Unit";

const Province = ({
  color,
  highlight,
  name,
  id,
  unit,
  dislodgedUnit,
  handleClick,
}: ProvinceDisplay & { handleClick: (id: string) => void }) => {
  return (
    <Card>
      <CardContent>
        <Typography>Name: {name}</Typography>
        <Typography>ID: {id}</Typography>
        <Typography>Color: {color}</Typography>
        <Typography>Highlight: {highlight}</Typography>
        <div>
          {unit && <Unit {...unit} />}
          {dislodgedUnit && <Unit {...dislodgedUnit} dislodged />}
        </div>
      </CardContent>
      <CardActions>
        <Button onClick={() => handleClick(id)}>Click</Button>
      </CardActions>
    </Card>
  );
};

export default Province;
