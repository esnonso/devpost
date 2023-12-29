import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classes from "./index.module.css";
import Backdrop from "../Backdrop";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Loader from "../Loader";
import axios from "axios";
import Button from "../Button";

export default function Prescription(props) {
  const router = useRouter();
  const [pills, setPills] = useState([]);
  const [foundpills, setFoundPills] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [quantityPill, setQuantityPill] = useState("");
  const [dose, setDose] = useState("");
  const [noOfDays, setNoOfDays] = useState(0);
  const [prescription, setPrescription] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("");
  const [showPillForm, setShowPillForm] = useState(false);

  const getPills = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/getPills");
      setPills(res.data.pills);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPills();
  }, []);

  const searchHandler = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 2) {
      setShowPillForm(false);
      const p = [];
      for (let pill of pills) {
        if (
          pill.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          pill.brand.toLowerCase().includes(e.target.value.toLowerCase())
        )
          p.push(pill);
      }
      setFoundPills(p);
    } else {
      setFoundPills([]);
    }
  };

  const selectPillHandler = (pill) => {
    setSearch("");
    setSelectedPill(pill);
    setFoundPills([]);
    setShowPillForm(true);
  };

  const addPrescriptionHandler = (pres) => {
    if (
      quantity === "" ||
      quantityPill === "" ||
      dose === "" ||
      noOfDays === 0
    ) {
      alert("Fill all inputs");
      return;
    }
    setPrescription((prevState) => [...prevState, pres]);
    setQuantity("");
    setQuantityPill("");
    setDose("");
    setNoOfDays(0);
    setShowPillForm(false);
  };

  const removePrescriptionItem = (id) => {
    setPrescription((prevState) => prevState.filter((p) => p.id === id));
  };

  const submitPrescriptionHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/addPrescription", {
        pills: prescription,
        messageId: props.messageId,
      });
      alert(response.data);
      router.push("/profile");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Backdrop />
      <div className={classes["pres-container"]}>
        <div style={{ textAlign: "right" }}>
          <button className={classes.btn} onClick={props.onHide}>
            x
          </button>
        </div>
        <Container width="100%" flex="column">
          <Container width="100%" flex="column" padding="0.5rem">
            <PTags fontSize="20px" margin="0 0 1rem 0">
              Prescription
            </PTags>
            {prescription.map((p) => (
              <Container key={p.id} justify="space-between" align="center">
                <PTags padding="0.5rem">
                  {p.brand} {p.name}
                </PTags>
                <PTags padding="0.5rem">{p.quantityPill}</PTags>
                <PTags padding="0.5rem">
                  {p.dose} Daily for {p.noOfDays} Days
                </PTags>
                <button
                  className={classes.btn}
                  onClick={() => removePrescriptionItem(p.id)}
                >
                  x
                </button>
              </Container>
            ))}

            <button
              className={classes["btn-form"]}
              onClick={submitPrescriptionHandler}
            >
              Prescribe
            </button>
          </Container>

          <Container width="100%" flex="column" padding="0.5rem">
            <PTags fontSize="20px" margin="0 0 1rem 0">
              Available Pills
            </PTags>
            <input
              type="text"
              placeholder="search pill"
              className={classes.search}
              onChange={searchHandler}
              value={search}
            />
            {foundpills.map((f) => (
              <Container key={f._id}>
                <PTags margin="0.5rem" width="80%" align="center">
                  {f.brand} {f.name}
                </PTags>

                <Button
                  text="+select"
                  margin="0.2rem 0 0.2rem 0"
                  back="#139D69"
                  click={() => selectPillHandler(f)}
                />
              </Container>
            ))}
            {showPillForm && (
              <Container
                width="100%"
                justify="space-around"
                align="center"
                margin="1rem 0 0 0"
              >
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={classes.pres}
                >
                  <option>Qty</option>
                  <option>1</option>
                  <option>2 </option>
                  <option>3 </option>
                  <option>4 </option>
                </select>
                <PTags>
                  {selectedPill.brand} {selectedPill.name}
                </PTags>

                <select
                  value={quantityPill}
                  onChange={(e) => setQuantityPill(e.target.value)}
                  className={classes.pres}
                >
                  <option>0 Tablet</option>
                  <option>1 Tablet</option>
                  <option>2 Tablet</option>
                  <option>3 Tablet</option>
                  <option>4 Tablet</option>
                </select>

                <select
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  className={classes.pres}
                >
                  <option>X0</option>
                  <option>X1</option>
                  <option>X2</option>
                  <option>X3</option>
                </select>
                <PTags>Daily. For</PTags>
                <input
                  type="number"
                  value={noOfDays}
                  onChange={(e) => setNoOfDays(e.target.value)}
                  className={classes.pres}
                />
                <PTags>Days</PTags>
                <Button
                  text="+add"
                  padding="0.2rem 0.5rem"
                  back="#139D69"
                  click={() =>
                    addPrescriptionHandler({
                      quantity,
                      quantityPill,
                      dose,
                      noOfDays,
                      brand: selectedPill.brand,
                      name: selectedPill.name,
                      id: selectedPill._id,
                      price: selectedPill.price,
                    })
                  }
                />
              </Container>
            )}
          </Container>
        </Container>
        {loading && <Loader />}
      </div>
    </>
  );
}
