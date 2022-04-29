import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { OpType } from "../../context/ApplicationContext";
import { Role, User } from "../../domain/User";
import { RootState } from "../../store";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { imageHelper } from "../ui/ImageHelper";
import classes from "./variations.module.css";

export const VariationRow = (props) => {
    const user = useSelector<RootState, User>((state) => state.auth.user);
    const [image, setImage] = useState(null);
    const variation = props.variation;

    const loadImage = async (name) => {
        setImage(await imageHelper.getImageFromServer(name, "variation"));
    };

    const handleOnClickRow = (op: OpType, variationId: string) => {
        switch (op) {
            case OpType.EDIT:
                props.onEdit(variationId);
                return;
            case OpType.DELETE:
                props.onDelete(variationId);
                return;
            case OpType.SELECT:
                props.onSelect(variation);
                return;
        }
    };

    useEffect(() => {
        loadImage(props.variation.image).then(undefined);
    }, [props.variation.image]);

    return (
        <>
            <tr style={{ verticalAlign: "center", margin: "0" }} className="align-middle">
                <td width="5%" align="center">
                    <div className={"list-image-panel"}>
                        <Image className={classes.imageTest} src={image} width={"60"} fluid title={variation.image}/>
                    </div>
                </td>
                <td width="30%">{variation.product}</td>
                <td width="20%" align="center">
                    {variation.drawings}
                </td>
                <td width="20%" align="center">
                    {variation.background}
                </td>
                <td width="10%" align="right">
                    {variation.price.toFixed(2)}
                </td>
                {user.role === Role.ADMIN && (
                    <td width="15%" align="center">
                        {props.op === OpType.SELECT &&
                            getActionIcon(ActionIconType.SELECT, {
                                color: "#000",
                                title: "select",
                                canClick: true,
                                onClick: () => handleOnClickRow(OpType.SELECT, variation._id),
                            })}
                        {props.op !== OpType.SELECT && (
                            <>
                                {getActionIcon(ActionIconType.EDIT, {
                                    title: "edit",
                                    canClick: true,
                                    onClick: () => handleOnClickRow(OpType.EDIT, variation._id),
                                })}
                                &nbsp;
                                {getActionIcon(ActionIconType.DELETE, {
                                    title: "delete",
                                    canClick: true,
                                    onClick: () => handleOnClickRow(OpType.DELETE, variation._id),
                                })}
                            </>
                        )}
                    </td>
                )}
            </tr>
        </>
    );
};
