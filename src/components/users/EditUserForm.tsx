import {useContext, useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";

export const EditUserForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const user = props.user;
    const viewOnly = props.op === "view";
    const isEdit = props.op === "edit";

    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });

    const handleSave = (event) => {
        event.preventDefault();
        if (!isDataValid()) return;

        const user = {
            role: formData.role,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
        };

        props.onSaveUser(user);
    };

    const isDataValid = (): boolean => {
        const {role, name, email, password, confirmPassword, phone} = formData;

        if (role.trim().length === 0 || name.trim().length === 0 || phone.trim().length === 0 ||
            email.trim().length === 0 || password.trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação!", "Perfil, nome, email, senha e telefone são obrigatórios!");
            return false;
        }

        if (!isEdit) {
            if (password !== confirmPassword) {
                appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação!", "A senha e a confirmação não são iguais!");
                return false;
            }
        }

        return true;
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };


    useEffect(() => {
        setFormData({
            role: user.role,
            name: user.name,
            email: user.email,
            password: user.password,
            confirmPassword: user.password,
            phone: user.phone,
            address: user.address,
        });
    }, [user]);

    const title = props.op === "new" ? "Novo" : props.op === "edit" ? "Editar" : "Visualizar";

    return (
        <>
            <div>
                <AlertToast />
                <Card border="dark">
                    <Card.Header as="h3">{`${title} User`}</Card.Header>
                    <Card.Body>
                        <form>
                            <div className="form-group spaced-form-group" >
                                <label>Perfil
                                    <span aria-hidden="true" className="required">*</span></label>
                                <select
                                    className="form-select bigger-input"
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    disabled={viewOnly}
                                    onChange={handleChange}>
                                    <option value="">--- Selecione um Perfil ---</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                    <option value="GUEST">Guest</option>
                                </select>
                            </div>
                            <div className="form-group spaced-form-group" >
                                <label>Nome
                                    <span aria-hidden="true" className="required">*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="form-control bigger-input"
                                    placeholder="Informe seu Nome completo"
                                    name="name"
                                    value={formData.name}
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group spaced-form-group" >
                                <label>Email
                                    <span aria-hidden="true" className="required">*</span></label>
                                <input
                                    required
                                    type="email"
                                    className="form-control bigger-input"
                                    placeholder="Informe seu Email"
                                    name="email"
                                    value={formData.email}
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                />
                                <small>O Email será utilizado como Login</small>
                            </div>
                            {(!viewOnly && !isEdit) &&
                                (
                                    <div className="form-group spaced-form-group" style={{display: "flex"}}>
                                        <div style={{float: "left", width: "20rem"}}>
                                            <label>Senha
                                                <span aria-hidden="true" className="required">*</span></label>
                                            <input
                                                required
                                                type="password"
                                                className="form-control bigger-input"
                                                placeholder="Informe uma senha"
                                                name="password"
                                                disabled={viewOnly || isEdit}
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        &nbsp;
                                        <div style={{float: "left", width: "20rem"}}>
                                            <label>Coonfirmação de Senha
                                                <span aria-hidden="true" className="required">*</span></label>
                                            <input
                                                required
                                                type="password"
                                                className="form-control bigger-input"
                                                placeholder="Confirme sua senha"
                                                name="confirmPassword"
                                                disabled={viewOnly || isEdit}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            <div className="form-group spaced-form-group" >
                                <label>Telefone
                                    <span aria-hidden="true" className="required">*</span></label>
                                <input
                                    type="text"
                                    className="form-control bigger-input"
                                    placeholder="Informe seu telefone"
                                    name="phone"
                                    value={formData.phone}
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                />
                                <small>Seu telefone será nossa forma principal de contato com você</small>
                            </div>
                            <div className="form-group spaced-form-group" >
                                <label>Endereço</label>
                                <input
                                    type="address"
                                    className="form-control bigger-input"
                                    placeholder="Informe seu endereço"
                                    name="address"
                                    value={formData.address}
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                />
                            </div>
                            <br/>
                        </form>
                    </Card.Body>
                </Card>
                <br/>
                <div className="align-content-end">
                    {!viewOnly && (
                        <>
                            <CustomButton caption="Salvar" onClick={handleSave} type="save"/>
                            <span>&nbsp;</span>
                        </>
                    )}
                    <CustomButton caption={viewOnly ? "Fechar" : "Cancelar"} onClick={handleCancel} type="close"/>
                    <p aria-hidden="true" id="required-description">
                        <span aria-hidden="true" className="required">*</span>Campo(s) obrigatório(s)
                    </p>
                </div>
            </div>
        </>
    );
};

