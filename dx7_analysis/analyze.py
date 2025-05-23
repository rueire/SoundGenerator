import pandas as pd
import matplotlib.pyplot as plt
import argparse
import os
import numpy as np

# -------------------------------------------------------------
# This app analyzes Yamaha DX7 patch data extracted from .syx files and converted to CSV format.
# It provides various analyses and visualizations of the data.

# Install required libraries:
# pip install lxml pandas matplotlib

# Run with:
# python analyze.py csvfile.csv

# The app is designed to be run from the command line.
# It takes a CSV file as input and generates various analyses and charts based on the data.
# The CSV file should be created using xml_to_csv.py, so that the data extracted from DX7 patches are in correct order for this app.

# The app provides a menu-driven interface for users to select different analyses to perform on the data.
# The output of the analyses includes mostly visualizations (charts) that can be displayed and saved.
# -------------------------------------------------------------

# Loads the csv file into a pandas dataframe.
def load_data(csv_path):
    df = pd.read_csv(csv_path)
    return df

# Analyzes the usage of algorithms (0–31).
def analyze_algorithm_distribution(df, filename):
    algo_counts = df['algorithm'].value_counts().sort_index()
    plt.figure(figsize=(18, 6))
    algo_counts.plot(kind='bar', color='skyblue')
    plt.title("DX7 most popular algoritms")
    plt.xlabel("Algorithm number")
    plt.ylabel("Number of patches")
    plt.xticks(rotation=90)
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes how often each LFO waveform is used.
def analyze_lfo_waveform(df, filename):
    waveform_counts = df['lfo_waveform'].value_counts().sort_index()
    plt.figure(figsize=(10, 6))
    waveform_counts.plot(kind='bar', color='orchid')
    plt.title("LFO Waveform usage")
    plt.xlabel("Waveform type")
    plt.ylabel("number of patches")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes the usage of transpose values.
def analyze_transpose(df, filename):
    transpose_counts = df['transpose'].value_counts().sort_index()
    plt.figure(figsize=(10, 6))
    transpose_counts.plot(kind='bar', color='salmon')
    plt.title("Transpose values")
    plt.xlabel("Transpose (Semitones)")
    plt.ylabel("number of patches")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes all operator output levels combined.
def analyze_output_levels(df, filename):
    operator_levels = []
    for op in range(1, 7):
        col = f"operator_{op}_output_level"
        if col in df.columns:
            operator_levels.append(df[col])
        else:
            print(f"Warning: Column '{col}' missing.")
            return

    # Combines all six operators' output levels into one list.
    all_levels = pd.concat(operator_levels, ignore_index=True)

    plt.figure(figsize=(10, 6))
    all_levels.plot(kind='hist', bins=32, color='goldenrod', edgecolor='black')
    plt.title(f"Output levels across all operators")
    plt.xlabel("Output level (0–99)")
    plt.ylabel("Frequency")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes LFO speed.
def analyze_lfo_speed(df, filename):
    speeds = df['lfo_speed'].dropna().astype(int)

    # Collects all values over 99 into a '100+' part (which are bad values).
    speeds_collected = speeds.apply(lambda x: x if x <= 99 else 100)

    # Counts occurrences of each value.
    value_counts = speeds_collected.value_counts().sort_index()

    # Makes the x-axis labels nicer.
    labels = [str(i) for i in range(0, 100)] + ['100+']
    counts = [value_counts.get(i, 0) for i in range(0, 100)] + [value_counts.get(100, 0)]

    plt.figure(figsize=(14, 6))
    plt.bar(labels, counts, color='steelblue', edgecolor='black')
    plt.title("LFO speed (range 0–99 + bad values 100+)")
    plt.xlabel("LFO speed")
    plt.ylabel("Number of patches")
    plt.xticks(rotation=90)
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes feedback level.
def analyze_feedback(df, filename):
    feedback_counts = df['feedback'].value_counts().sort_index()
    plt.figure(figsize=(8, 6))
    feedback_counts.plot(kind='bar', color='lightcoral', edgecolor='black')
    plt.title("Feedback amount distribution")
    plt.xlabel("Feedback (0–7)")
    plt.ylabel("Number of patches")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes LFO delay time.
def analyze_lfo_delay(df, filename):
    delay = df['lfo_delay'].dropna().astype(int)
    delay_counts = delay.value_counts().sort_index()
    plt.figure(figsize=(12, 6))
    delay_counts.plot(kind='bar', color='mediumslateblue', edgecolor='black')
    plt.title("LFO delay time")
    plt.xlabel("LFO delay (0–99)")
    plt.ylabel("Number of patches")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes pitch modulation sensitivity.
def analyze_pitch_mod_sensitivity(df, filename):
    pms_counts = df['pitch_mod_sensitivity'].value_counts().sort_index()
    plt.figure(figsize=(8, 6))
    pms_counts.plot(kind='bar', color='seagreen', edgecolor='black')
    plt.title("Pitch modulation sensitivity")
    plt.xlabel("Sensitivity (0–7)")
    plt.ylabel("Number of patches")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes LFO pitch modulation depth.
def analyze_lfo_pm_depth(df, filename):
    pm = df['lfo_pm_depth'].dropna().astype(int)
    pm_counts = pm.value_counts().sort_index()
    plt.figure(figsize=(12, 6))
    pm_counts.plot(kind='bar', color='dodgerblue', edgecolor='black')
    plt.title("LFO pitch modulation depth")
    plt.xlabel("PM depth (0–99)")
    plt.ylabel("Number of patches")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes LFO amplitude modulation depth.
def analyze_lfo_am_depth(df, filename):
    am = df['lfo_am_depth'].dropna().astype(int)
    am_counts = am.value_counts().sort_index()
    plt.figure(figsize=(12, 6))
    am_counts.plot(kind='bar', color='darkorange', edgecolor='black')
    plt.title("LFO amplitude modulation depth")
    plt.xlabel("AM depth (0–99)")
    plt.ylabel("Number of patches")
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes pitch EG rates.
# This function creates histograms for each pitch EG rate.
# It also prints the exact counts of each rate value.
def analyze_pitch_eg_rates(df, filename):
    plt.figure(figsize=(18, 6))
    bin_edges = np.arange(0, 101)

    for i in range(1, 5):
        col = f'pitch_eg_rate{i}'
        if col in df.columns:
            data = df[col].dropna().astype(int)
            plt.hist(data, bins=bin_edges, alpha=0.5, label=f'Rate {i}')
            print(f"\nPitch EG rate {i}:")
            counts = data.value_counts().sort_index()
            for val, count in counts.items():
                print(f"{val}: {count:,}")
        else:
            print(f"Missing column: {col}")

    bin_centers = 0.5 * (bin_edges[:-1] + bin_edges[1:])
    plt.xticks(bin_centers, [str(i) for i in range(0, 100)])
    plt.title("Pitch envelope generator rates")
    plt.xlabel("Rate value (0–99)")
    plt.ylabel("Number of patches")
    plt.legend()
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# Analyzes pitch EG levels.
# This function creates histograms for each pitch EG level.
def analyze_pitch_eg_levels(df, filename):
    plt.figure(figsize=(18, 6))
    bin_edges = np.arange(0, 101)

    for i in range(1, 5):
        col = f'pitch_eg_level{i}'
        if col in df.columns:
            data = df[col].dropna().astype(int)
            plt.hist(data, bins=bin_edges, alpha=0.5, label=f'Level {i}')
            print(f"\nPitch EG level {i}:")
            counts = data.value_counts().sort_index()
            for val, count in counts.items():
                print(f"{val}: {count:,}")
        else:
            print(f"Missing column: {col}")

    bin_centers = 0.5 * (bin_edges[:-1] + bin_edges[1:])
    plt.xticks(bin_centers, [str(i) for i in range(0, 100)])
    plt.title("Pitch envelope generator levels")
    plt.xlabel("Level value (0–99)")
    plt.ylabel("Number of patches")
    plt.legend()
    plt.grid(axis='y')
    plt.tight_layout()
    plt.show()

# General function for analyzing operator-level parameter.
def analyze_operator_param(df, param_suffix, title, xlabel, bins=None, per_operator=False):
    # Chooses default bins based on the parameter type, if not provided.
    if bins is None:
        if "frequency_coarse" in param_suffix:
            bins = np.arange(0, 33)  # 0 to 32 for 32 values (0–31)
        elif "oscillator_mode" in param_suffix:
            bins = np.arange(0, 3)   # 0 to 2 for two bins (0 and 1)
        elif "output_level" in param_suffix:
            bins = np.arange(0, 102)  # 0 to 101 for values 0–100
        else:
            bins = np.arange(0, 101)

    if per_operator:
        # Draws each operator separately.
        plt.figure(figsize=(14, 8))

        for i in range(1, 7):
            col = f"operator_{i}_{param_suffix}"
            if col in df.columns:
                data = df[col]
                plt.hist(data, bins=bins, alpha=0.5, label=f"Operator {i}")

                # Prints exact counts for each operator.
                print(f"\n{title} – Operator {i}:")
                value_counts = data.value_counts().sort_index()
                for val, count in value_counts.items():
                    print(f"{val}: {count:,}")

        plt.title(f"{title} (per operator)")
        plt.xlabel(xlabel)
        plt.ylabel("usage in patches")

        # Aligns xticks to bin centers (otherwise they're in between the bins).
        bin_centers = 0.5 * (bins[1:] + bins[:-1])
        plt.xticks(bin_centers, [str(int(x)) for x in bins[:-1]])

        plt.legend()
        plt.grid(axis='y')
        plt.tight_layout()
        plt.show()

    else:
        # Combines all operators into one big list.
        all_values = []
        for i in range(1, 7):
            col = f"operator_{i}_{param_suffix}"
            if col in df.columns:
                all_values.append(df[col])
        combined = pd.concat(all_values, ignore_index=True)

        # Prints usage summary.
        value_counts = combined.value_counts().sort_index().astype(int)
        print(f"\n{title} (exact usage across all operators):")
        print(f"\nOperator value: times used")
        for val, count in value_counts.items():
            print(f"{val}: {count:,}")

        # Fix for oscillator_mode, shows otherwise weird decimals in chart.
        if param_suffix == "oscillator_mode":
            # Ensures x positions are integers (0 and 1).
            x_positions = [int(val) for val in value_counts.index]
            heights = list(value_counts.values)

            plt.figure(figsize=(10, 6))
            plt.bar(x_positions, heights, color='mediumseagreen', edgecolor='black')
            plt.xticks([0, 1], ["0", "1"])

            # Fixes y-axis formatting (disables the notation 1e6 or something).
            plt.ticklabel_format(axis='y', style='plain')

            plt.title(f"{title} (all operators)")
            plt.xlabel(xlabel)
            plt.ylabel("usage in patches")
            plt.grid(axis='y')
            plt.tight_layout()
            plt.show()
            return  # Exits early so normal histogram doesn't run.

        # Normal histogram path for all other parameters.
        plt.figure(figsize=(10, 6))
        counts, bin_edges, _ = plt.hist(combined, bins=bins, color='mediumseagreen', edgecolor='black')

        plt.title(f"{title} (all operators)")
        plt.xlabel(xlabel)
        plt.ylabel("usage in patches")

        # Aligns xticks to bin centers.
        bin_centers = 0.5 * (bin_edges[1:] + bin_edges[:-1])
        plt.xticks(bin_centers, [str(int(x)) for x in bin_edges[:-1]])

        plt.grid(axis='y')
        plt.tight_layout()
        plt.show()

# Draws a simple envelope generator (EG) curve.
# This function is used to visualize the EG levels for each operator.
def draw_eg_curve(levels, label=None):
    # Draws a simple 4-stage EG shape using DX7 EG levels (1-4).
    times = [0, 1, 2, 3, 4]
    points = [levels[0], levels[1], levels[2], levels[3], 0]  # Ends at level 0 for decay.
    plt.plot(times, points, marker='o', label=label)

# Draws an average EG level curve for a chosen algorithm, showing all 6 operators.
def draw_operator_eg_level_curve_for_algorithm(df, algorithm):
    subset = df[df["algorithm"] == algorithm]

    if subset.empty:
        print(f"No patches found for algorithm {algorithm}.")
        return

    plt.figure(figsize=(12, 8))

    for op in range(1, 7):
        avg_levels = [
            subset[f"operator_{op}_eg_level1"].mean(),
            subset[f"operator_{op}_eg_level2"].mean(),
            subset[f"operator_{op}_eg_level3"].mean(),
            subset[f"operator_{op}_eg_level4"].mean()
        ]

        draw_eg_curve(avg_levels, label=f"Operator {op}")

    plt.title(f"Average EG level curves for all operators – Algorithm {algorithm}")
    plt.xlabel("Stage (attack → decay → sustain → release)")
    plt.ylabel("Level (0–99)")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

# Converts EG rate to a time duration in seconds.
# Yamaha DX7’s actual rate-to-time mapping is nonlinear and influenced by many factors,
# so this function tries to make up somewhat realistic visual estimate of those EG rates.
def rate_to_time(rate, max_time=5.0):
    # Higher eg_rate means smaller time (99 is fastest).
    # Estimates: fastest = 0.01 sec, slowest = 5 sec.
    rate = max(1, min(rate, 99))
    # Makes the time curve steeper for lower rates.
    return max_time * (1.0 - rate / 99.0) ** 2

# Plots the average time-evolving envelope curves for all 6 operators in a given algorithm based on EG levels and rates.
def draw_time_eg_curve(df, algorithm):
    subset = df[df["algorithm"] == algorithm]

    if subset.empty:
        print(f"No patches found for algorithm {algorithm}.")
        return

    plt.figure(figsize=(12, 8))

    # Loops through the 6 operators.
    for op in range(1, 7):
        try:
            levels = [subset[f"operator_{op}_eg_level{i}"].mean() for i in range(1, 5)]
            rates  = [subset[f"operator_{op}_eg_rate{i}"].mean() for i in range(1, 5)]
        except KeyError:
            print(f"Missing EG data for operator {op}.")
            continue

        times = [rate_to_time(r) for r in rates]

        # Builds envelope segments.
        envelope_times = [0]
        envelope_levels = [levels[0]]

        stages = [
            (levels[0], levels[1], times[0]),  # Attack: eg_level1 -> eg_level2
            (levels[1], levels[2], times[1]),  # Decay: eg_level2 -> eg_level3
            (levels[2], levels[2], 0.5),       # Sustain: holds eg_level3
            (levels[2], levels[3], times[3])   # Release: eg_level3 -> eg_level4
        ]

        for start, end, duration in stages:
            t = np.linspace(envelope_times[-1], envelope_times[-1] + duration, num=100)
            l = np.linspace(start, end, num=100)
            envelope_times.extend(t[1:])
            envelope_levels.extend(l[1:])

        plt.plot(envelope_times, envelope_levels, label=f"Operator {op}")

    plt.title(f"Simulated envelope generator(EG) stages - Algorithm {algorithm}")
    plt.xlabel("Time based on eg rate (approx. seconds)")
    plt.ylabel("EG level (0–99)")
    plt.yticks(np.arange(0, 101, 10))
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.show()

# Main menu function for the analysis.
def menu(df, filename):
    while True:
        print("\nChoose what to analyze:")
        print("1. Algorithm usage")
        print("2. LFO waveform")
        print("3. Transpose values")
        print("4. Operator output levels")
        print("5. DEBUG - invalid transpose values")
        print("6. LFO speed")
        print("7. Output level usage (across all operators)")
        print("8. Output level per operator")
        print("9. Oscillator mode usage (all operators)")
        print("10. Oscillator mode per operator")
        print("11. Frequency coarse distribution (all operators)")
        print("12. Frequency coarse per operator")
        print("13. Feedback level")
        print("14. LFO delay")
        print("15. Pitch modulation sensitivity")
        print("16. LFO pitch modulation depth")
        print("17. LFO amplitude modulation depth")
        print("18. Pitch EG Rates 1–4")
        print("19. Pitch EG Levels 1–4")
        print("20. EG rate 1-4")
        print("21. EG level 1-4")
        print("22. Key scaling parameters (per operator)")
        print("23. Oscillator detune (per operator)")
        print("24. Rate scaling (per operator)")
        print("25. Key velocity sensitivity (per operator)")
        print("26. Amplitude modulation sensitivity (per operator)")
        print("27. Fine frequency tuning (per operator)")
        print("28: Draw average EG level curve for an algorithm")
        print("29: Simulate time-based EG curve for an algorithm")
        print("0. Exit")

        choice = input("Enter choice (1–29), or 0 for exit: ").strip()

        if choice == '1':
            analyze_algorithm_distribution(df, filename)
        elif choice == '2':
            analyze_lfo_waveform(df, filename)
        elif choice == '3':
            analyze_transpose(df, filename)
        elif choice == '4':
            analyze_output_levels(df, filename)
        elif choice == "5":
            inspect_invalid_transpose(df)
        elif choice == "6":
            analyze_lfo_speed(df, filename)
        elif choice == '7':
            analyze_operator_param(df, "output_level", "Output level usage", "Output level")
        elif choice == '8':
            analyze_operator_param(df, "output_level", "Output level usage", "Output level", per_operator=True)
        elif choice == '9':
            analyze_operator_param(df, "oscillator_mode", "Oscillator mode usage", "Mode (0:Ratio, 1:Fixed)")
        elif choice == '10':
            analyze_operator_param(df, "oscillator_mode", "Oscillator mode usage", "Mode (0:Ratio, 1:Fixed)", per_operator=True)
        elif choice == '11':
            analyze_operator_param(df, "frequency_coarse", "Coarse frequency usage", "Coarse frequency (0–31)")
        elif choice == '12':
            analyze_operator_param(df, "frequency_coarse", "Coarse frequency usage", "Coarse frequency (0–31)", per_operator=True)
        elif choice == '13':
            analyze_feedback(df, filename)
        elif choice == '14':
            analyze_lfo_delay(df, filename)
        elif choice == '15':
            analyze_pitch_mod_sensitivity(df, filename)
        elif choice == '16':
            analyze_lfo_pm_depth(df, filename)
        elif choice == '17':
            analyze_lfo_am_depth(df, filename)
        elif choice == '18':
            analyze_pitch_eg_rates(df, filename)
        elif choice == '19':
            analyze_pitch_eg_levels(df, filename)
        elif choice == "20":
            for i in range(1, 5):
                analyze_operator_param(
                    df,
                    param_suffix=f"eg_rate{i}",
                    title=f"Envelope Generator rate {i}",
                    xlabel=f"EG Rate {i} value (0–99)",
                    bins=np.arange(0, 101),
                    per_operator=True
                )
        elif choice == "21":
            for i in range(1, 5):
                analyze_operator_param(
                    df,
                    param_suffix=f"eg_level{i}",
                    title=f"Envelope Generator level {i}",
                    xlabel=f"EG Level {i} value (0–99)",
                    bins=np.arange(0, 101),
                    per_operator=True
                )
        elif choice == "22":
            key_scaling_params = [
                ("key_scaling_break",        "Key scaling break point",        "Break point (0–99)", np.arange(0, 101)),
                ("key_scaling_left_depth",   "Key scaling left depth",         "Left depth (0–99)", np.arange(0, 101)),
                ("key_scaling_right_depth",  "Key scaling right depth",        "Right depth (0–99)", np.arange(0, 101)),
                ("key_scaling_left_curve",   "Key scaling left curve type",    "Left curve (0–3)", np.arange(0, 5)),
                ("key_scaling_right_curve",  "Key scaling right curve type",   "Right curve (0–3)", np.arange(0, 5)),
            ]

            for param_suffix, title, xlabel, bins in key_scaling_params:
                analyze_operator_param(
                    df,
                    param_suffix=param_suffix,
                    title=title,
                    xlabel=xlabel,
                    bins=bins,
                    per_operator=True
                )
        elif choice == "23":
            analyze_operator_param(
                df,
                param_suffix="oscillator_detune",
                title="Oscillator detune",
                xlabel="Detune (0–14, where 7 is default)",
                bins=np.arange(0, 16),
                per_operator=True
            )
        elif choice == "24":
            analyze_operator_param(
                df,
                param_suffix="rate_scaling",
                title="Rate scaling",
                xlabel="Rate scaling (0–7)",
                bins=np.arange(0, 9),
                per_operator=True
            )
        elif choice == "25":
            analyze_operator_param(
                df,
                param_suffix="key_velocity_sensitivity",
                title="Key velocity sensitivity",
                xlabel="Velocity sensitivity (0–7)",
                bins=np.arange(0, 9),
                per_operator=True
            )
        elif choice == "26":
            analyze_operator_param(
                df,
                param_suffix="amp_mod_sensitivity",
                title="Amplitude modulation sensitivity",
                xlabel="AM sensitivity (0–3)",
                bins=np.arange(0, 5),
                per_operator=True
            )
        elif choice == "27":
            analyze_operator_param(
                df,
                param_suffix="frequency_fine",
                title="Fine frequency tuning",
                xlabel="Fine frequency (0–99)",
                bins=np.arange(0, 101),
                per_operator=True
            )
        elif choice == "28":
            try:
                alg = int(input("Enter algorithm number (1–32): ").strip())
                if alg not in range(1, 33):
                    print("Invalid algorithm number.")
                else:
                    draw_operator_eg_level_curve_for_algorithm(df, algorithm=alg)
            except ValueError:
                print("Please enter a valid algorithm number (1–32).")
        elif choice == "29":
            try:
                alg = int(input("Enter algorithm number (1–32): ").strip())
                if alg not in range(1, 33):
                    print("Invalid algorithm number.")
                else:
                    draw_time_eg_curve(df, algorithm=alg)
            except ValueError:
                print("Please enter a valid algorithm number (1-32).")
        elif choice == '0':
            print("Exiting DX7 patch analyzer...")
            break
        else:
            print("Not a valid choice, please enter correct number.")

# Shows patches with transpose values over 48 (which are from bad patches).
def inspect_invalid_transpose(df):
    invalid = df[df['transpose'] > 48]
    if invalid.empty:
        print("All transpose values are within the valid range (0–48).")
    else:
        print("Found transpose values over 48:")
        print(invalid[['id', 'name', 'transpose', 'source']])

# Main function to run the analysis tool.
def main():
    parser = argparse.ArgumentParser(description="Analyze DX7 patch data")
    parser.add_argument("csv", help="Path to CSV file")
    parser.add_argument("--output", default="charts", help="Output directory for charts")
    args = parser.parse_args()

    if not os.path.exists(args.csv):
        print(f"Error: CSV file '{args.csv}' not found.")
        return

    os.makedirs(args.output, exist_ok=True)

    df = load_data(args.csv)
    menu(df, os.path.basename(args.csv))

if __name__ == "__main__":
    main()