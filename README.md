This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Introduction

This project is **Hospital solution**. It is a role based and built with [Nextjs].it is a platform where people can chat with a doctor and get prescriptions which they can from the hospital and get it delivered to their home, book an appointment with a doctor or for a lab test and get a date scheduled ahead and more for **subscribed\* **users\*\*. The application uses Web5 technology and gives users the choice to own their data or subscribe and give the hospital permission to hold their data and records.

The roles are divided into 3 major categories;

1. **An unsubscribed user** who would not be registered. This user can raise a complain providing their gender and age range so the best doctor, based on age and gender gets matched to them. This user's did:ion will serve as the unique identifier for the message. A doctor will attend to this complain and engage this user in a chat using **Web5 Technology** by writing to their \*_dwns_. After the chat the doctor will add a prescription to the message for the user and the user can checkout get the pills delivered to the address provided by them. This user can also book appointments and get an approved date written to their dwns.

2. **A subscribed user** who will be registered whose full details, chat history and medical records will be saved to the hospital database. This user will perform all functions done by the web5 user and more based on the hospital's recommendation. All data will be saved to the hospital database.

3. **Staff of the hospital**
   i. An administrator to add, delete and edit staff and pills.
   ii. A doctor to attend to complaints, chat with patients and recommend pills for the patient. The doctor also attend to appointments from patients.
   iii. A lab attendant to attend to patients who want to schedule a lab test appointment.

## GETTING STARTED

run `npm install` to install all packages.

`create env file and provide`

# NEXTAUTH_SECRET=`yoursecret`

# MONGO_URI= `your mongodb connection string`

# NEXTAUTT_URL=`your production url` --ignore if running on development---

run `npm run dev` to run the server and visit [App](http://localhost:3000)

You can find a sample of this project running on [Devpost-Hospital](https://devpost-eight.vercel.app)
