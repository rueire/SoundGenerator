import pandas as pd
import matplotlib.pyplot as plt
import argparse
import os
import numpy as np

# -------------------------------------------------------------
# CLI-based DX7 patch analyzer app.

# Let's you analyze a csv file, print out the exact values and produce charts based on the analyzes.
# The charts can be saved on the computer.

# -------------------------------------------------------------
# Install pandas and matplotlib. (pip install pandas matplotlib)
# Run with:
# python analyze.py csvfile.csv
# -------------------------------------------------------------

# After the chart pop ups, remember to close it to continue using the CLI app.
# -------------------------------------------------------------

# Loads csv into a pandas dataframe.
def load_data(csv_path):
    df = pd.read_csv(csv_path)
    return df

# Analyzes how often each algorithm (0–31) is used.
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

# Analyzes how often each LFO waveform type appears.
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
    # Drops NaN and converts to integers.
    speeds = df['lfo_speed'].dropna().astype(int)

    # Clamps all values over 99 into a '100+' part.
    speeds_clamped = speeds.apply(lambda x: x if x <= 99 else 100)

    # Counts occurrences of each value, including '100+'.
    value_counts = speeds_clamped.value_counts().sort_index()

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

# General function for analyzing any operator-level parameter.
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

# Displays the main menu and routes user's choice.
def menu(df, filename):
    while True:
        print("\nChoose what to analyze:")
        print("1. Algorithm popularity")
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
        print("0. Exit")

        choice = input("Enter choice (1–12), 0 for exit: ").strip()

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
        elif choice == '0':
            print("Exiting...")
            break
        else:
            print("Invalid choice, please enter correct number.")

# Shows patches with transpose values over 48 (which are from bad patches).
def inspect_invalid_transpose(df):
    invalid = df[df['transpose'] > 48]
    if invalid.empty:
        print("All transpose values are within the valid range (0–48).")
    else:
        print("Found transpose values over 48:")
        print(invalid[['id', 'name', 'transpose', 'source']])

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