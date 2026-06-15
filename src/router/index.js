import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CidsList from '../views/cids/CidsList.vue'
import CidsForm from '../views/cids/CidsForm.vue'
import MedicationsList from '../views/medications/MedicationsList.vue'
import MedicationsForm from '../views/medications/MedicationsForm.vue'
import MedicalHistoriesList from '../views/medicalhistories/MedicalHistoriesList.vue'
import MedicalHistoriesForm from '../views/medicalhistories/MedicalHistoriesForm.vue'
import PatientsList from '../views/patients/PatientsList.vue'
import PatientsForm from '../views/patients/PatientsForm.vue'
import PatientsDetail from '../views/patients/PatientsDetail.vue'
import DoctorsList from '../views/doctors/DoctorsList.vue'
import DoctorsForm from '../views/doctors/DoctorsForm.vue'
import DoctorsDetail from '../views/doctors/DoctorsDetail.vue'
import ConsultsList from '../views/consults/ConsultsList.vue'
import ConsultsForm from '../views/consults/ConsultsForm.vue'
import ConsultsDetail from '../views/consults/ConsultsDetail.vue'
import ExamsList from '../views/exams/ExamsList.vue'
import ExamsForm from '../views/exams/ExamsForm.vue'
import PrescriptionsList from '../views/prescriptions/PrescriptionsList.vue'
import PrescriptionsForm from '../views/prescriptions/PrescriptionsForm.vue'
import PrescriptionsDetail from '../views/prescriptions/PrescriptionsDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },

    { path: '/cids', component: CidsList },
    { path: '/cids/add', component: CidsForm },
    { path: '/cids/:id/edit', component: CidsForm },

    { path: '/medications', component: MedicationsList },
    { path: '/medications/add', component: MedicationsForm },
    { path: '/medications/:id/edit', component: MedicationsForm },

    { path: '/medicalhistories', component: MedicalHistoriesList },
    { path: '/medicalhistories/add', component: MedicalHistoriesForm },
    { path: '/medicalhistories/:id/edit', component: MedicalHistoriesForm },

    { path: '/patients', component: PatientsList },
    { path: '/patients/add', component: PatientsForm },
    { path: '/patients/:id', component: PatientsDetail },
    { path: '/patients/:id/edit', component: PatientsForm },

    { path: '/doctors', component: DoctorsList },
    { path: '/doctors/add', component: DoctorsForm },
    { path: '/doctors/:id', component: DoctorsDetail },
    { path: '/doctors/:id/edit', component: DoctorsForm },

    { path: '/consults', component: ConsultsList },
    { path: '/consults/add', component: ConsultsForm },
    { path: '/consults/:id', component: ConsultsDetail },
    { path: '/consults/:id/edit', component: ConsultsForm },

    { path: '/exams', component: ExamsList },
    { path: '/exams/add', component: ExamsForm },
    { path: '/exams/:id/edit', component: ExamsForm },

    { path: '/prescriptions', component: PrescriptionsList },
    { path: '/prescriptions/add', component: PrescriptionsForm },
    { path: '/prescriptions/:id', component: PrescriptionsDetail },
    { path: '/prescriptions/:id/edit', component: PrescriptionsForm },
  ],
})

export default router
