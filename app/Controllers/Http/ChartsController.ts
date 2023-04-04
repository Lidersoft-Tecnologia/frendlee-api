import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import Customer from "App/Models/Customer";
import Provider from "App/Models/Provider";
import Appointment from "App/Models/Appointment";
import Database from "@ioc:Adonis/Lucid/Database";

const LOCALE = "en-US";

type IDataset = {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor: string | string[];
  borderColor: string | string[];
};

type IChartData = { title: string; labels: string[]; datasets: IDataset[] };

type IDateLabel = { label: string; startSqlDate: string; endSqlDate: string };

type ICount = Array<{ total: string }>;

function getMonthDays(month: number) {
  const date = new Date();
  date.setMonth(month);
  const d = new Date(date.getFullYear(), month + 1, 0);
  return d.getDate();
}

function formatDateToString(date: Date) {
  return date.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatDateToSqlDate(date: Date) {
  return DateTime.fromJSDate(date).toSQL({ includeZone: true });
}

function getStartAndEndSqlDate(date: Date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  const startSqlDate = formatDateToSqlDate(startDate);
  const endSqlDate = formatDateToSqlDate(endDate);
  return { startSqlDate, endSqlDate };
}

function getDateLabels(period: string) {
  const dateLabels: IDateLabel[] = [];

  if (period === "last_year") {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(1);
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(getMonthDays(endDate.getMonth()));
    const yearMonth = 12;

    for (let i = 0; i != yearMonth; i++) {
      const startSqlDate = formatDateToSqlDate(startDate);
      const endSqlDate = formatDateToSqlDate(endDate);
      const monthName = startDate.toLocaleString(LOCALE, { month: "short" });
      dateLabels.unshift({ label: monthName, startSqlDate, endSqlDate });
      startDate.setMonth(startDate.getMonth() - 1);
      endDate.setDate(1);
      endDate.setMonth(endDate.getMonth() - 1);
      endDate.setDate(getMonthDays(endDate.getMonth()));
    }
  } else if (period === "last_month") {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const monthDays = getMonthDays(currentDate.getMonth());

    for (let i = 0; i != monthDays; i++) {
      const label = formatDateToString(currentDate);
      const { startSqlDate, endSqlDate } = getStartAndEndSqlDate(currentDate);

      dateLabels.unshift({ label, startSqlDate, endSqlDate });
      currentDate.setDate(currentDate.getDate() - 1);
    }
  } else {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const weekDays = 7;

    for (let i = 0; i != weekDays; i++) {
      const label = formatDateToString(currentDate);
      const { startSqlDate, endSqlDate } = getStartAndEndSqlDate(currentDate);

      dateLabels.unshift({ label, startSqlDate, endSqlDate });
      currentDate.setDate(currentDate.getDate() - 1);
    }
  }
  return dateLabels;
}

export default class ChartsController {
  public async registrations({ request, response }: HttpContextContract) {
    try {
      const { period = "last_week" } = request.qs();
      const dateLabels = getDateLabels(period);

      const customerDataset: IDataset = {
        label: "Customers",
        data: [],
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.3)",
      };
      const providerDataset: IDataset = {
        label: "Providers",
        data: [],
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235,0.3)",
      };

      for (const dateLabel of dateLabels) {
        const [customersFound, providersFound] = await Promise.all([
          Customer.query()
            .where("created_at", ">=", dateLabel.startSqlDate)
            .where("created_at", "<", dateLabel.endSqlDate),
          Provider.query()
            .where("created_at", ">=", dateLabel.startSqlDate)
            .where("created_at", "<", dateLabel.endSqlDate),
        ]);

        customerDataset.data.push(customersFound.length);
        providerDataset.data.push(providersFound.length);
      }

      const chartData: IChartData = {
        title: "New registrations",
        labels: dateLabels.map((dateLabel) => dateLabel.label),
        datasets: [customerDataset, providerDataset],
      };
      response.status(200).send(chartData);
    } catch (error) {
      response.status(500).send({
        error: {
          message: "Internal error.",
          error_message: error,
        },
      });
    }
  }

  public async appointments({ request, response }: HttpContextContract) {
    try {
      const { period = "last_week" } = request.qs();
      const dateLabels = getDateLabels(period);

      const appointmentDataset: IDataset = {
        label: "Appointments",
        data: [],
        fill: false,
        backgroundColor: "rgb(153,102,255)",
        borderColor: "rgba(153,102,255,0.3)",
      };

      for (const dateLabel of dateLabels) {
        const appointmentsFound = await Appointment.query()
          .where("created_at", ">=", dateLabel.startSqlDate)
          .where("created_at", "<", dateLabel.endSqlDate);

        appointmentDataset.data.push(appointmentsFound.length);
      }

      const chartData: IChartData = {
        title: "New appointments",
        labels: dateLabels.map((dateLabel) => dateLabel.label),
        datasets: [appointmentDataset],
      };
      response.status(200).send(chartData);
    } catch (error) {
      response.status(500).send({
        error: {
          message: "Internal error.",
          error_message: error,
        },
      });
    }
  }

  public async totalRegistrations({ response }: HttpContextContract) {
    try {
      const totalDataset: IDataset = {
        label: "Total",
        data: [],
        fill: false,
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        borderColor: ["rgba(255, 99, 132, 0.3)", "rgba(54, 162, 235,0.3)"],
      };

      const [countCustomers]: ICount = await Database.from(
        Customer.table
      ).count("id as total");
      const [countProviders]: ICount = await Database.from(
        Provider.table
      ).count("id as total");

      const totalCustomers = Number(countCustomers.total);
      const totalProviders = Number(countProviders.total);
      const totalUsers = totalCustomers + totalProviders;
      const customersPercentage = (totalCustomers * 100) / totalUsers;
      const providerPercentage = 100 - customersPercentage;

      totalDataset.data.push(totalCustomers);
      totalDataset.data.push(totalProviders);

      const chartData: IChartData = {
        title: "Total registrations",
        labels: [
          `Customers (${customersPercentage.toPrecision(3)}%)`,
          `Providers (${providerPercentage.toPrecision(3)}%)`,
        ],
        datasets: [totalDataset],
      };
      response.status(200).send(chartData);
    } catch (error) {
      response.status(500).send({
        error: {
          message: "Internal error.",
          error_message: error,
        },
      });
    }
  }
}
